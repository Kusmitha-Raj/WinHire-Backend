using Microsoft.AspNetCore.Mvc;
using WinHire.Backend.Models;
using WinHire.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace WinHire.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AvailabilityController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<AvailabilityController> _logger;

    public AvailabilityController(AppDbContext context, ILogger<AvailabilityController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all availabilities
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PanelistAvailability>>> GetAllAvailabilities()
    {
        try
        {
            var availabilities = await _context.PanelistAvailabilities
                .Include(a => a.Panelist)
                .ToListAsync();
            
            // Order in memory since SQLite doesn't support TimeSpan ordering
            var ordered = availabilities
                .OrderBy(a => a.AvailableDate)
                .ThenBy(a => a.StartTime)
                .ToList();
                
            return Ok(ordered);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving availabilities");
            return StatusCode(500, new { message = "An error occurred while retrieving availabilities" });
        }
    }

    /// <summary>
    /// Get availability by panelist ID
    /// </summary>
    [HttpGet("panelist/{panelistId}")]
    public async Task<ActionResult<IEnumerable<PanelistAvailability>>> GetByPanelist(int panelistId)
    {
        try
        {
            var availabilities = await _context.PanelistAvailabilities
                .Include(a => a.Panelist)
                .Where(a => a.PanelistId == panelistId)
                .ToListAsync();
                
            // Order in memory since SQLite doesn't support TimeSpan ordering
            var ordered = availabilities
                .OrderBy(a => a.AvailableDate)
                .ThenBy(a => a.StartTime)
                .ToList();
                
            return Ok(ordered);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving availabilities for panelist {PanelistId}", panelistId);
            return StatusCode(500, new { message = "An error occurred while retrieving availabilities" });
        }
    }

    /// <summary>
    /// Get available panelists for a specific date and time range
    /// </summary>
    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailablePanelists(
        [FromQuery] DateTime date,
        [FromQuery] TimeSpan startTime,
        [FromQuery] TimeSpan endTime)
    {
        try
        {
            var availabilities = await _context.PanelistAvailabilities
                .Include(a => a.Panelist)
                .Where(a => a.AvailableDate.Date == date.Date
                    && a.Status == AvailabilityStatus.Available
                    && a.StartTime <= startTime
                    && a.EndTime >= endTime)
                .Select(a => new
                {
                    a.Id,
                    PanelistId = a.Panelist!.Id,
                    PanelistName = a.Panelist.Name,
                    PanelistEmail = a.Panelist.Email,
                    Department = a.Panelist.Department,
                    a.AvailableDate,
                    a.StartTime,
                    a.EndTime,
                    a.Status
                })
                .ToListAsync();
            return Ok(availabilities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving available panelists");
            return StatusCode(500, new { message = "An error occurred while retrieving available panelists" });
        }
    }

    /// <summary>
    /// Create availability
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PanelistAvailability>> CreateAvailability([FromBody] CreateAvailabilityDto dto)
    {
        try
        {
            // Parse the time strings to TimeSpan
            if (!TimeSpan.TryParse(dto.StartTime, out var startTime))
            {
                return BadRequest(new { message = "Invalid start time format. Expected HH:MM or HH:MM:SS" });
            }
            
            if (!TimeSpan.TryParse(dto.EndTime, out var endTime))
            {
                return BadRequest(new { message = "Invalid end time format. Expected HH:MM or HH:MM:SS" });
            }

            var availability = new PanelistAvailability
            {
                PanelistId = dto.PanelistId,
                AvailableDate = dto.AvailableDate,
                StartTime = startTime,
                EndTime = endTime,
                Status = dto.Status ?? "Available",
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow
            };

            _context.PanelistAvailabilities.Add(availability);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetByPanelist), new { panelistId = availability.PanelistId }, availability);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating availability: {Message}", ex.Message);
            return StatusCode(500, new { message = $"An error occurred while creating availability: {ex.Message}" });
        }
    }

    public class CreateAvailabilityDto
    {
        public int PanelistId { get; set; }
        public DateTime AvailableDate { get; set; }
        public string StartTime { get; set; } = "";
        public string EndTime { get; set; } = "";
        public string? Status { get; set; }
        public string? Notes { get; set; }
    }

    /// <summary>
    /// Update availability
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<PanelistAvailability>> UpdateAvailability(int id, [FromBody] PanelistAvailability availability)
    {
        try
        {
            var existing = await _context.PanelistAvailabilities.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Availability with ID {id} not found" });

            existing.AvailableDate = availability.AvailableDate;
            existing.StartTime = availability.StartTime;
            existing.EndTime = availability.EndTime;
            existing.Status = availability.Status;
            existing.Notes = availability.Notes;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating availability {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating availability" });
        }
    }

    /// <summary>
    /// Delete availability
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAvailability(int id)
    {
        try
        {
            var availability = await _context.PanelistAvailabilities.FindAsync(id);
            if (availability == null)
                return NotFound(new { message = $"Availability with ID {id} not found" });

            _context.PanelistAvailabilities.Remove(availability);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting availability {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting availability" });
        }
    }
}
