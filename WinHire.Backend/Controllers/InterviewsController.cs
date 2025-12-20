using Microsoft.AspNetCore.Mvc;
using WinHire.Backend.Models;
using WinHire.Backend.Services;

namespace WinHire.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InterviewsController : ControllerBase
{
    private readonly IInterviewService _interviewService;
    private readonly ILogger<InterviewsController> _logger;

    public InterviewsController(
        IInterviewService interviewService,
        ILogger<InterviewsController> logger)
    {
        _interviewService = interviewService;
        _logger = logger;
    }

    /// <summary>
    /// Get all interviews
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Interview>>> GetAllInterviews()
    {
        try
        {
            var interviews = await _interviewService.GetAllInterviewsAsync();
            return Ok(interviews);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving interviews");
            return StatusCode(500, new { message = "An error occurred while retrieving interviews" });
        }
    }

    /// <summary>
    /// Get interview by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Interview>> GetInterview(int id)
    {
        try
        {
            var interview = await _interviewService.GetInterviewByIdAsync(id);
            if (interview == null)
                return NotFound(new { message = $"Interview with ID {id} not found" });

            return Ok(interview);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving interview {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the interview" });
        }
    }

    /// <summary>
    /// Get interviews by application ID
    /// </summary>
    [HttpGet("application/{applicationId}")]
    public async Task<ActionResult<IEnumerable<Interview>>> GetInterviewsByApplication(int applicationId)
    {
        try
        {
            var interviews = await _interviewService.GetInterviewsByApplicationIdAsync(applicationId);
            return Ok(interviews);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving interviews for application {ApplicationId}", applicationId);
            return StatusCode(500, new { message = "An error occurred while retrieving interviews" });
        }
    }

    /// <summary>
    /// Get interviews by interviewer ID
    /// </summary>
    [HttpGet("interviewer/{interviewerId}")]
    public async Task<ActionResult<IEnumerable<Interview>>> GetInterviewsByInterviewer(int interviewerId)
    {
        try
        {
            var interviews = await _interviewService.GetInterviewsByInterviewerIdAsync(interviewerId);
            return Ok(interviews);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving interviews for interviewer {InterviewerId}", interviewerId);
            return StatusCode(500, new { message = "An error occurred while retrieving interviews" });
        }
    }

    /// <summary>
    /// Create new interview
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Interview>> CreateInterview([FromBody] Interview interview)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _interviewService.CreateInterviewAsync(interview);
            return CreatedAtAction(nameof(GetInterview), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating interview");
            return StatusCode(500, new { message = "An error occurred while creating the interview" });
        }
    }

    /// <summary>
    /// Update interview
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<Interview>> UpdateInterview(int id, [FromBody] Interview interview)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _interviewService.UpdateInterviewAsync(id, interview);
            if (updated == null)
                return NotFound(new { message = $"Interview with ID {id} not found" });

            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating interview {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the interview" });
        }
    }

    /// <summary>
    /// Update interview status
    /// </summary>
    [HttpPut("{id}/status")]
    public async Task<ActionResult<Interview>> UpdateInterviewStatus(
        int id,
        [FromBody] UpdateStatusRequest request)
    {
        try
        {
            var updated = await _interviewService.UpdateInterviewStatusAsync(id, request.Status);
            if (updated == null)
                return NotFound(new { message = $"Interview with ID {id} not found" });

            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating interview status {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the interview status" });
        }
    }

    /// <summary>
    /// Complete interview
    /// </summary>
    [HttpPost("{id}/complete")]
    public async Task<ActionResult> CompleteInterview(int id)
    {
        try
        {
            var success = await _interviewService.CompleteInterviewAsync(id);
            if (!success)
                return NotFound(new { message = $"Interview with ID {id} not found" });

            return Ok(new { message = "Interview completed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing interview {Id}", id);
            return StatusCode(500, new { message = "An error occurred while completing the interview" });
        }
    }

    /// <summary>
    /// Delete interview
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteInterview(int id)
    {
        try
        {
            var deleted = await _interviewService.DeleteInterviewAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Interview with ID {id} not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting interview {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the interview" });
        }
    }
}
