using System.ComponentModel.DataAnnotations;

namespace WinHire.Backend.Models;

public class Interview
{
    public int Id { get; set; }

    public int ApplicationId { get; set; }
    public Application Application { get; set; } = null!;

    [StringLength(100)]
    public string Title { get; set; } = string.Empty;

    [StringLength(50)]
    public string Type { get; set; } = "Technical"; // Technical, HR, Managerial, Final

    public DateTime ScheduledDateTime { get; set; }

    public int DurationMinutes { get; set; } = 60;

    [StringLength(200)]
    public string? MeetingLink { get; set; }

    [StringLength(200)]
    public string? Location { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = "Scheduled"; // Scheduled, Completed, Cancelled, Rescheduled

    public int? InterviewerId { get; set; }
    public User? Interviewer { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    // Navigation properties
    public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
}
