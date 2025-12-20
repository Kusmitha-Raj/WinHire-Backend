using Microsoft.EntityFrameworkCore;
using WinHire.Backend.Data;
using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public class JobService : IJobService
{
    private readonly AppDbContext _context;

    public JobService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Job>> GetAllJobsAsync()
    {
        return await _context.Jobs
            .Include(j => j.HiringManager)
            .ToListAsync();
    }

    public async Task<IEnumerable<Job>> GetActiveJobsAsync()
    {
        return await _context.Jobs
            .Include(j => j.HiringManager)
            .Where(j => j.Status == "Open")
            .ToListAsync();
    }

    public async Task<Job?> GetJobByIdAsync(int id)
    {
        return await _context.Jobs
            .Include(j => j.HiringManager)
            .FirstOrDefaultAsync(j => j.Id == id);
    }

    public async Task<Job> CreateJobAsync(Job job)
    {
        job.PostedDate = DateTime.UtcNow;
        job.Status = "Open";
        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();
        return job;
    }

    public async Task<Job?> UpdateJobAsync(int id, Job job)
    {
        var existing = await _context.Jobs.FindAsync(id);
        if (existing == null)
            return null;

        existing.Title = job.Title;
        existing.Description = job.Description;
        existing.Department = job.Department;
        existing.Location = job.Location;
        existing.MinExperience = job.MinExperience;
        existing.MaxExperience = job.MaxExperience;
        existing.RequiredSkills = job.RequiredSkills;
        existing.MinSalary = job.MinSalary;
        existing.MaxSalary = job.MaxSalary;
        existing.EmploymentType = job.EmploymentType;
        existing.Status = job.Status;
        existing.OpenPositions = job.OpenPositions;
        existing.ClosingDate = job.ClosingDate;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteJobAsync(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null)
            return false;

        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CloseJobAsync(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null)
            return false;

        job.Status = "Closed";
        job.ClosingDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }
}
