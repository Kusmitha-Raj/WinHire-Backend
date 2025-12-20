using Microsoft.AspNetCore.Mvc;
using WinHire.Backend.Models;
using WinHire.Backend.Services;

namespace WinHire.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CandidatesController : ControllerBase
{
    private readonly ICandidateService _candidateService;
    private readonly ILogger<CandidatesController> _logger;

    public CandidatesController(
        ICandidateService candidateService,
        ILogger<CandidatesController> logger)
    {
        _candidateService = candidateService;
        _logger = logger;
    }

    /// <summary>
    /// Get all candidates
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Candidate>>> GetAllCandidates()
    {
        try
        {
            var candidates = await _candidateService.GetAllCandidatesAsync();
            return Ok(candidates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving candidates");
            return StatusCode(500, new { message = "An error occurred while retrieving candidates" });
        }
    }

    /// <summary>
    /// Get candidate by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Candidate>> GetCandidate(int id)
    {
        try
        {
            var candidate = await _candidateService.GetCandidateByIdAsync(id);
            if (candidate == null)
                return NotFound(new { message = $"Candidate with ID {id} not found" });

            return Ok(candidate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving candidate {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the candidate" });
        }
    }

    /// <summary>
    /// Create new candidate
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Candidate>> CreateCandidate([FromBody] Candidate candidate)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _candidateService.CreateCandidateAsync(candidate);
            return CreatedAtAction(nameof(GetCandidate), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating candidate");
            return StatusCode(500, new { message = "An error occurred while creating the candidate" });
        }
    }

    /// <summary>
    /// Update candidate
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<Candidate>> UpdateCandidate(int id, [FromBody] Candidate candidate)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _candidateService.UpdateCandidateAsync(id, candidate);
            if (updated == null)
                return NotFound(new { message = $"Candidate with ID {id} not found" });

            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating candidate {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the candidate" });
        }
    }

    /// <summary>
    /// Update candidate status only
    /// </summary>
    [HttpPut("{id}/status")]
    public async Task<ActionResult<Candidate>> UpdateCandidateStatus(
        int id, 
        [FromBody] UpdateStatusRequest request)
    {
        try
        {
            var updated = await _candidateService.UpdateCandidateStatusAsync(id, request.Status);
            if (updated == null)
                return NotFound(new { message = $"Candidate with ID {id} not found" });

            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating candidate status {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the candidate status" });
        }
    }

    /// <summary>
    /// Delete candidate
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCandidate(int id)
    {
        try
        {
            var deleted = await _candidateService.DeleteCandidateAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Candidate with ID {id} not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting candidate {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the candidate" });
        }
    }
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
