using Microsoft.AspNetCore.Mvc;
using WinHire.Backend.Models;
using WinHire.Backend.Services;

namespace WinHire.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;
    private readonly ILogger<ApplicationsController> _logger;

    public ApplicationsController(
        IApplicationService applicationService,
        ILogger<ApplicationsController> logger)
    {
        _applicationService = applicationService;
        _logger = logger;
    }

    /// <summary>
    /// Get all applications
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Application>>> GetAllApplications()
    {
        try
        {
            var applications = await _applicationService.GetAllApplicationsAsync();
            return Ok(applications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving applications");
            return StatusCode(500, new { message = "An error occurred while retrieving applications" });
        }
    }

    /// <summary>
    /// Get application by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Application>> GetApplication(int id)
    {
        try
        {
            var application = await _applicationService.GetApplicationByIdAsync(id);
            if (application == null)
                return NotFound(new { message = $"Application with ID {id} not found" });

            return Ok(application);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving application {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the application" });
        }
    }

    /// <summary>
    /// Get applications by job ID
    /// </summary>
    [HttpGet("job/{jobId}")]
    public async Task<ActionResult<IEnumerable<Application>>> GetApplicationsByJob(int jobId)
    {
        try
        {
            var applications = await _applicationService.GetApplicationsByJobIdAsync(jobId);
            return Ok(applications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving applications for job {JobId}", jobId);
            return StatusCode(500, new { message = "An error occurred while retrieving applications" });
        }
    }

    /// <summary>
    /// Get applications by candidate ID
    /// </summary>
    [HttpGet("candidate/{candidateId}")]
    public async Task<ActionResult<IEnumerable<Application>>> GetApplicationsByCandidate(int candidateId)
    {
        try
        {
            var applications = await _applicationService.GetApplicationsByCandidateIdAsync(candidateId);
            return Ok(applications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving applications for candidate {CandidateId}", candidateId);
            return StatusCode(500, new { message = "An error occurred while retrieving applications" });
        }
    }

    /// <summary>
    /// Create new application
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Application>> CreateApplication([FromBody] Application application)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _applicationService.CreateApplicationAsync(application);
            return CreatedAtAction(nameof(GetApplication), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating application");
            return StatusCode(500, new { message = "An error occurred while creating the application" });
        }
    }

    /// <summary>
    /// Update application
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<Application>> UpdateApplication(int id, [FromBody] Application application)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _applicationService.UpdateApplicationAsync(id, application);
            if (updated == null)
                return NotFound(new { message = $"Application with ID {id} not found" });

            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating application {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the application" });
        }
    }

    /// <summary>
    /// Update application status only
    /// </summary>
    [HttpPut("{id}/status")]
    public async Task<ActionResult<Application>> UpdateApplicationStatus(
        int id,
        [FromBody] UpdateStatusRequest request)
    {
        try
        {
            var updated = await _applicationService.UpdateApplicationStatusAsync(id, request.Status);
            if (updated == null)
                return NotFound(new { message = $"Application with ID {id} not found" });

            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating application status {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the application status" });
        }
    }

    /// <summary>
    /// Delete application
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteApplication(int id)
    {
        try
        {
            var deleted = await _applicationService.DeleteApplicationAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Application with ID {id} not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting application {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the application" });
        }
    }
}
