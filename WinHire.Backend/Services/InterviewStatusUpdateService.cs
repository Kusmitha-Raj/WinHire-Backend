using WinHire.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace WinHire.Backend.Services;

public class InterviewStatusUpdateService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<InterviewStatusUpdateService> _logger;
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(5); // Check every 5 minutes

    public InterviewStatusUpdateService(
        IServiceProvider serviceProvider,
        ILogger<InterviewStatusUpdateService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Interview Status Update Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await UpdateInterviewStatuses();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating interview statuses");
            }

            await Task.Delay(_interval, stoppingToken);
        }

        _logger.LogInformation("Interview Status Update Service stopped");
    }

    private async Task UpdateInterviewStatuses()
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var now = DateTime.UtcNow;

        // Find interviews that should be marked as Completed
        var interviewsToComplete = await context.Interviews
            .Where(i => i.Status == "Scheduled" 
                && i.ScheduledDateTime.AddMinutes(i.DurationMinutes) < now)
            .ToListAsync();

        if (interviewsToComplete.Any())
        {
            foreach (var interview in interviewsToComplete)
            {
                interview.Status = "Completed";
                interview.CompletedAt = interview.ScheduledDateTime.AddMinutes(interview.DurationMinutes);
                _logger.LogInformation("Auto-completed interview {InterviewId} for application {ApplicationId}", 
                    interview.Id, interview.ApplicationId);
            }

            await context.SaveChangesAsync();
            _logger.LogInformation("Updated {Count} interviews to Completed status", interviewsToComplete.Count);
        }
    }
}
