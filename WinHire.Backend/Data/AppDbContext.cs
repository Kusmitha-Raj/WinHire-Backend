using Microsoft.EntityFrameworkCore;
using WinHire.Backend.Models;

namespace WinHire.Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<Application> Applications { get; set; }
    public DbSet<Interview> Interviews { get; set; }
    public DbSet<Feedback> Feedbacks { get; set; }
    public DbSet<PanelistAvailability> PanelistAvailabilities { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Candidate configuration
        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.RoleApplied).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
        });

        // User configuration
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Application configuration
        modelBuilder.Entity<Application>()
            .HasOne(a => a.Candidate)
            .WithMany()
            .HasForeignKey(a => a.CandidateId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Application>()
            .HasOne(a => a.Job)
            .WithMany(j => j.Applications)
            .HasForeignKey(a => a.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Application>()
            .HasOne(a => a.Recruiter)
            .WithMany()
            .HasForeignKey(a => a.RecruterId)
            .OnDelete(DeleteBehavior.SetNull);

        // Interview configuration
        modelBuilder.Entity<Interview>()
            .HasOne(i => i.Application)
            .WithMany(a => a.Interviews)
            .HasForeignKey(i => i.ApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Interview>()
            .HasOne(i => i.Interviewer)
            .WithMany(u => u.AssignedInterviews)
            .HasForeignKey(i => i.InterviewerId)
            .OnDelete(DeleteBehavior.SetNull);

        // Feedback configuration
        modelBuilder.Entity<Feedback>()
            .HasOne(f => f.Interview)
            .WithMany(i => i.Feedbacks)
            .HasForeignKey(f => f.InterviewId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Feedback>()
            .HasOne(f => f.Application)
            .WithMany(a => a.Feedbacks)
            .HasForeignKey(f => f.ApplicationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Feedback>()
            .HasOne(f => f.ProvidedBy)
            .WithMany(u => u.ProvidedFeedback)
            .HasForeignKey(f => f.ProvidedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Job configuration
        modelBuilder.Entity<Job>()
            .HasOne(j => j.HiringManager)
            .WithMany()
            .HasForeignKey(j => j.HiringManagerId)
            .OnDelete(DeleteBehavior.SetNull);

        // PanelistAvailability configuration
        modelBuilder.Entity<PanelistAvailability>()
            .HasOne(pa => pa.Panelist)
            .WithMany()
            .HasForeignKey(pa => pa.PanelistId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed default admin user
        // Note: Password is "admin123" - hashed with BCrypt
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "Admin",
                Email = "admin@winhire.com",
                PasswordHash = "$2a$11$5xKxZ5KJZxKxZ5KxZ5KxZeO5xKxZ5KxZ5KxZ5KxZ5KxZ5KxZ5Kx", // Placeholder - will be updated on startup
                Role = UserRoles.Admin,
                Department = "IT",
                IsActive = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
