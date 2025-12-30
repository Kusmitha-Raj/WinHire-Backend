using System.ComponentModel.DataAnnotations;

namespace WinHire.Backend.Models;

public class Feedback
{
    public int Id { get; set; }

    public int? InterviewId { get; set; }
    public Interview? Interview { get; set; }

    public int? ApplicationId { get; set; }
    public Application? Application { get; set; }

    public int ProvidedByUserId { get; set; }
    public User? ProvidedBy { get; set; }

    [Range(1, 10)]
    public int? TechnicalSkillsRating { get; set; }

    [Range(1, 10)]
    public int? CommunicationRating { get; set; }

    [Range(1, 10)]
    public int? ProblemSolvingRating { get; set; }

    [Range(1, 10)]
    public int? CulturalFitRating { get; set; }

    [Range(1, 10)]
    public int? OverallRating { get; set; }

    [Required]
    public string Comments { get; set; } = string.Empty;

    [StringLength(50)]
    public string Recommendation { get; set; } = "Pending"; // StrongHire, Hire, Maybe, NoHire, Pending

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
