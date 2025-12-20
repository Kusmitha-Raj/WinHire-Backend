using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WinHire.Backend.Models;

public class Application
{
    public int Id { get; set; }

    public int CandidateId { get; set; }
    public Candidate Candidate { get; set; } = null!;

    public int JobId { get; set; }
    public Job Job { get; set; } = null!;

    public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

    [StringLength(50)]
    public string Status { get; set; } = "Applied"; // Applied, Screening, Interview, Offered, Rejected, Accepted

    public string? ResumeUrl { get; set; }
    public string? CoverLetter { get; set; }

    public int? RecruterId { get; set; }
    public User? Recruiter { get; set; }

    public string? Notes { get; set; }

    public DateTime? LastUpdated { get; set; }

    // Navigation properties
    [JsonIgnore]
    public ICollection<Interview> Interviews { get; set; } = new List<Interview>();
    [JsonIgnore]
    public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
}
