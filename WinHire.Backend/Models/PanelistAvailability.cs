using System.ComponentModel.DataAnnotations;

namespace WinHire.Backend.Models;

public class PanelistAvailability
{
    public int Id { get; set; }

    public int PanelistId { get; set; }
    public User? Panelist { get; set; }

    public DateTime AvailableDate { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = "Available"; // Available, Booked, Unavailable

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public static class AvailabilityStatus
{
    public const string Available = "Available";
    public const string Booked = "Booked";
    public const string Unavailable = "Unavailable";
}
