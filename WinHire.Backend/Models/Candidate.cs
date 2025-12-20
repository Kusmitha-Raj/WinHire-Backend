namespace WinHire.Backend.Models;

public class Candidate
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string RoleApplied { get; set; } = string.Empty;
    public int? YearsOfExperience { get; set; }
    public string? Skills { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    public DateTime? AppliedDate { get; set; }
}

public static class CandidateStatus
{
    public const string ApplicationReceived = "Application Received";
    public const string UnderReview = "Under Review";
    public const string Shortlisted = "Shortlisted";
    public const string InterviewScheduled = "Interview Scheduled";
    public const string Selected = "Selected";
    public const string Rejected = "Rejected";

    public static readonly string[] AllStatuses = 
    {
        ApplicationReceived,
        UnderReview,
        Shortlisted,
        InterviewScheduled,
        Selected,
        Rejected
    };
}
