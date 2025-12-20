using Microsoft.AspNetCore.Mvc;
using WinHire.Backend.Models;
using WinHire.Backend.Services;

namespace WinHire.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly IFeedbackService _feedbackService;
    private readonly ILogger<FeedbackController> _logger;

    public FeedbackController(
        IFeedbackService feedbackService,
        ILogger<FeedbackController> logger)
    {
        _feedbackService = feedbackService;
        _logger = logger;
    }

    /// <summary>
    /// Get all feedback
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedback()
    {
        try
        {
            var feedback = await _feedbackService.GetAllFeedbackAsync();
            return Ok(feedback);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving feedback");
            return StatusCode(500, new { message = "An error occurred while retrieving feedback" });
        }
    }

    /// <summary>
    /// Get feedback by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Feedback>> GetFeedback(int id)
    {
        try
        {
            var feedback = await _feedbackService.GetFeedbackByIdAsync(id);
            if (feedback == null)
                return NotFound(new { message = $"Feedback with ID {id} not found" });

            return Ok(feedback);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving feedback {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the feedback" });
        }
    }

    /// <summary>
    /// Get feedback by interview ID
    /// </summary>
    [HttpGet("interview/{interviewId}")]
    public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbackByInterview(int interviewId)
    {
        try
        {
            var feedback = await _feedbackService.GetFeedbackByInterviewIdAsync(interviewId);
            return Ok(feedback);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving feedback for interview {InterviewId}", interviewId);
            return StatusCode(500, new { message = "An error occurred while retrieving feedback" });
        }
    }

    /// <summary>
    /// Get feedback by application ID
    /// </summary>
    [HttpGet("application/{applicationId}")]
    public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbackByApplication(int applicationId)
    {
        try
        {
            var feedback = await _feedbackService.GetFeedbackByApplicationIdAsync(applicationId);
            return Ok(feedback);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving feedback for application {ApplicationId}", applicationId);
            return StatusCode(500, new { message = "An error occurred while retrieving feedback" });
        }
    }

    /// <summary>
    /// Create new feedback
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Feedback>> CreateFeedback([FromBody] Feedback feedback)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _feedbackService.CreateFeedbackAsync(feedback);
            return CreatedAtAction(nameof(GetFeedback), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating feedback");
            return StatusCode(500, new { message = "An error occurred while creating the feedback" });
        }
    }

    /// <summary>
    /// Update feedback
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<Feedback>> UpdateFeedback(int id, [FromBody] Feedback feedback)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _feedbackService.UpdateFeedbackAsync(id, feedback);
            if (updated == null)
                return NotFound(new { message = $"Feedback with ID {id} not found" });

            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating feedback {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the feedback" });
        }
    }

    /// <summary>
    /// Delete feedback
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteFeedback(int id)
    {
        try
        {
            var deleted = await _feedbackService.DeleteFeedbackAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Feedback with ID {id} not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting feedback {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the feedback" });
        }
    }
}
