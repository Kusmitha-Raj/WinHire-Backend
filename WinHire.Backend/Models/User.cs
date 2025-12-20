using System.ComponentModel.DataAnnotations;

namespace WinHire.Backend.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Role { get; set; } = string.Empty; // Admin, Recruiter, HiringManager, Panelist

    [StringLength(50)]
    public string? Department { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastLogin { get; set; }

    // Navigation properties
    public ICollection<Interview> AssignedInterviews { get; set; } = new List<Interview>();
    public ICollection<Feedback> ProvidedFeedback { get; set; } = new List<Feedback>();
}

public static class UserRoles
{
    public const string Admin = "Admin";
    public const string Recruiter = "Recruiter";
    public const string HiringManager = "HiringManager";
    public const string Panelist = "Panelist";
}
