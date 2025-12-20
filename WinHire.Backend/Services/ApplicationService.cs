using Microsoft.EntityFrameworkCore;
using WinHire.Backend.Data;
using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public class ApplicationService : IApplicationService
{
    private readonly AppDbContext _context;

    public ApplicationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Application>> GetAllApplicationsAsync()
    {
        return await _context.Applications
            .Include(a => a.Candidate)
            .Include(a => a.Job)
            .Include(a => a.Recruiter)
            .ToListAsync();
    }

    public async Task<Application?> GetApplicationByIdAsync(int id)
    {
        return await _context.Applications
            .Include(a => a.Candidate)
            .Include(a => a.Job)
            .Include(a => a.Recruiter)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Application>> GetApplicationsByJobIdAsync(int jobId)
    {
        return await _context.Applications
            .Include(a => a.Candidate)
            .Include(a => a.Recruiter)
            .Where(a => a.JobId == jobId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Application>> GetApplicationsByCandidateIdAsync(int candidateId)
    {
        return await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.Recruiter)
            .Where(a => a.CandidateId == candidateId)
            .ToListAsync();
    }

    public async Task<Application> CreateApplicationAsync(Application application)
    {
        application.AppliedDate = DateTime.UtcNow;
        application.Status = "Applied";
        _context.Applications.Add(application);
        await _context.SaveChangesAsync();
        return application;
    }

    public async Task<Application?> UpdateApplicationAsync(int id, Application application)
    {
        var existing = await _context.Applications.FindAsync(id);
        if (existing == null)
            return null;

        existing.Status = application.Status;
        existing.ResumeUrl = application.ResumeUrl;
        existing.CoverLetter = application.CoverLetter;
        existing.Notes = application.Notes;
        existing.RecruterId = application.RecruterId;
        existing.LastUpdated = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<Application?> UpdateApplicationStatusAsync(int id, string status)
    {
        var application = await _context.Applications.FindAsync(id);
        if (application == null)
            return null;

        application.Status = status;
        application.LastUpdated = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return application;
    }

    public async Task<bool> DeleteApplicationAsync(int id)
    {
        var application = await _context.Applications.FindAsync(id);
        if (application == null)
            return false;

        _context.Applications.Remove(application);
        await _context.SaveChangesAsync();
        return true;
    }
}
