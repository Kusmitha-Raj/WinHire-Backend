using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace WinHire.Backend.Models;

public class Job
{
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [StringLength(100)]
    public string Department { get; set; } = string.Empty;

    [StringLength(100)]
    public string Location { get; set; } = string.Empty;

    public int MinExperience { get; set; }
    public int MaxExperience { get; set; }

    public string RequiredSkills { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal? MinSalary { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? MaxSalary { get; set; }

    [StringLength(50)]
    public string EmploymentType { get; set; } = "Full-Time"; // Full-Time, Part-Time, Contract

    [StringLength(50)]
    public string Status { get; set; } = "Open"; // Open, Closed, OnHold

    public int? HiringManagerId { get; set; }
    public User? HiringManager { get; set; }

    public DateTime PostedDate { get; set; } = DateTime.UtcNow;
    public DateTime? ClosingDate { get; set; }

    public int OpenPositions { get; set; } = 1;

    // Navigation properties
    [JsonIgnore]
    public ICollection<Application> Applications { get; set; } = new List<Application>();
}
