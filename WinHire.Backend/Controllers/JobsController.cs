using Microsoft.AspNetCore.Mvc;
using WinHire.Backend.Models;
using WinHire.Backend.Services;

namespace WinHire.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;
    private readonly ILogger<JobsController> _logger;

    public JobsController(IJobService jobService, ILogger<JobsController> logger)
    {
        _jobService = jobService;
        _logger = logger;
    }

    /// <summary>
    /// Get all jobs
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Job>>> GetAllJobs()
    {
        try
        {
            var jobs = await _jobService.GetAllJobsAsync();
            return Ok(jobs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving jobs");
            return StatusCode(500, new { message = "An error occurred while retrieving jobs" });
        }
    }

    /// <summary>
    /// Get active jobs only
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<Job>>> GetActiveJobs()
    {
        try
        {
            var jobs = await _jobService.GetActiveJobsAsync();
            return Ok(jobs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active jobs");
            return StatusCode(500, new { message = "An error occurred while retrieving active jobs" });
        }
    }

    /// <summary>
    /// Get job by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Job>> GetJob(int id)
    {
        try
        {
            var job = await _jobService.GetJobByIdAsync(id);
            if (job == null)
                return NotFound(new { message = $"Job with ID {id} not found" });

            return Ok(job);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving job {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the job" });
        }
    }

    /// <summary>
    /// Create new job
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Job>> CreateJob([FromBody] Job job)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _jobService.CreateJobAsync(job);
            return CreatedAtAction(nameof(GetJob), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating job");
            return StatusCode(500, new { message = "An error occurred while creating the job" });
        }
    }

    /// <summary>
    /// Update job
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<Job>> UpdateJob(int id, [FromBody] Job job)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _jobService.UpdateJobAsync(id, job);
            if (updated == null)
                return NotFound(new { message = $"Job with ID {id} not found" });

            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating job {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating the job" });
        }
    }

    /// <summary>
    /// Close job
    /// </summary>
    [HttpPost("{id}/close")]
    public async Task<ActionResult> CloseJob(int id)
    {
        try
        {
            var success = await _jobService.CloseJobAsync(id);
            if (!success)
                return NotFound(new { message = $"Job with ID {id} not found" });

            return Ok(new { message = "Job closed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error closing job {Id}", id);
            return StatusCode(500, new { message = "An error occurred while closing the job" });
        }
    }

    /// <summary>
    /// Delete job
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteJob(int id)
    {
        try
        {
            var deleted = await _jobService.DeleteJobAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Job with ID {id} not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting job {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the job" });
        }
    }
}
