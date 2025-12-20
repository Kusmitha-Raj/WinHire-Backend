using Microsoft.AspNetCore.Mvc;

namespace WinHire.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgentStatusController : ControllerBase
{
    private readonly ILogger<AgentStatusController> _logger;
    private static readonly Dictionary<string, AgentStatus> _agentStatuses = new();
    private static readonly object _lock = new();

    public AgentStatusController(ILogger<AgentStatusController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Get status of all agents
    /// </summary>
    [HttpGet]
    public ActionResult<IEnumerable<AgentStatus>> GetAllAgentStatuses()
    {
        lock (_lock)
        {
            return Ok(_agentStatuses.Values);
        }
    }

    /// <summary>
    /// Update agent status (called by agents)
    /// </summary>
    [HttpPost("heartbeat")]
    public ActionResult UpdateAgentStatus([FromBody] AgentHeartbeat heartbeat)
    {
        lock (_lock)
        {
            if (_agentStatuses.ContainsKey(heartbeat.AgentName))
            {
                var status = _agentStatuses[heartbeat.AgentName];
                status.LastHeartbeat = DateTime.UtcNow;
                status.Status = "Running";
                status.ProcessedCount += heartbeat.ProcessedCount;
            }
            else
            {
                _agentStatuses[heartbeat.AgentName] = new AgentStatus
                {
                    AgentName = heartbeat.AgentName,
                    Status = "Running",
                    LastHeartbeat = DateTime.UtcNow,
                    ProcessedCount = heartbeat.ProcessedCount,
                    StartedAt = DateTime.UtcNow
                };
            }
        }

        return Ok();
    }

    /// <summary>
    /// Get statistics about agent activity
    /// </summary>
    [HttpGet("stats")]
    public ActionResult<object> GetAgentStats()
    {
        lock (_lock)
        {
            var stats = new
            {
                TotalAgents = _agentStatuses.Count,
                ActiveAgents = _agentStatuses.Values.Count(a => 
                    a.LastHeartbeat > DateTime.UtcNow.AddMinutes(-2)),
                TotalProcessed = _agentStatuses.Values.Sum(a => a.ProcessedCount),
                Agents = _agentStatuses.Values.Select(a => new
                {
                    a.AgentName,
                    a.Status,
                    a.ProcessedCount,
                    a.LastHeartbeat,
                    SecondsSinceLastHeartbeat = (DateTime.UtcNow - a.LastHeartbeat).TotalSeconds,
                    IsActive = a.LastHeartbeat > DateTime.UtcNow.AddMinutes(-2)
                })
            };

            return Ok(stats);
        }
    }
}

public class AgentStatus
{
    public string AgentName { get; set; } = string.Empty;
    public string Status { get; set; } = "Unknown";
    public DateTime LastHeartbeat { get; set; }
    public DateTime StartedAt { get; set; }
    public int ProcessedCount { get; set; }
}

public class AgentHeartbeat
{
    public string AgentName { get; set; } = string.Empty;
    public int ProcessedCount { get; set; }
}
