using Microsoft.EntityFrameworkCore;
using WinHire.Backend.Data;
using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public class InterviewService : IInterviewService
{
    private readonly AppDbContext _context;

    public InterviewService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Interview>> GetAllInterviewsAsync()
    {
        return await _context.Interviews
            .Include(i => i.Application)
                .ThenInclude(a => a.Candidate)
            .Include(i => i.Application)
                .ThenInclude(a => a.Job)
            .Include(i => i.Interviewer)
            .ToListAsync();
    }

    public async Task<Interview?> GetInterviewByIdAsync(int id)
    {
        return await _context.Interviews
            .Include(i => i.Application)
                .ThenInclude(a => a.Candidate)
            .Include(i => i.Application)
                .ThenInclude(a => a.Job)
            .Include(i => i.Interviewer)
            .Include(i => i.Feedbacks)
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<IEnumerable<Interview>> GetInterviewsByApplicationIdAsync(int applicationId)
    {
        return await _context.Interviews
            .Include(i => i.Interviewer)
            .Where(i => i.ApplicationId == applicationId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Interview>> GetInterviewsByInterviewerIdAsync(int interviewerId)
    {
        return await _context.Interviews
            .Include(i => i.Application)
                .ThenInclude(a => a.Candidate)
            .Include(i => i.Application)
                .ThenInclude(a => a.Job)
            .Where(i => i.InterviewerId == interviewerId)
            .ToListAsync();
    }

    public async Task<Interview> CreateInterviewAsync(Interview interview)
    {
        interview.CreatedAt = DateTime.UtcNow;
        interview.Status = "Scheduled";
        _context.Interviews.Add(interview);
        await _context.SaveChangesAsync();
        return interview;
    }

    public async Task<Interview?> UpdateInterviewAsync(int id, Interview interview)
    {
        var existing = await _context.Interviews.FindAsync(id);
        if (existing == null)
            return null;

        existing.Title = interview.Title;
        existing.Type = interview.Type;
        existing.ScheduledDateTime = interview.ScheduledDateTime;
        existing.DurationMinutes = interview.DurationMinutes;
        existing.MeetingLink = interview.MeetingLink;
        existing.Location = interview.Location;
        existing.Status = interview.Status;
        existing.InterviewerId = interview.InterviewerId;
        existing.Notes = interview.Notes;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<Interview?> UpdateInterviewStatusAsync(int id, string status)
    {
        var interview = await _context.Interviews.FindAsync(id);
        if (interview == null)
            return null;

        interview.Status = status;
        await _context.SaveChangesAsync();
        return interview;
    }

    public async Task<bool> DeleteInterviewAsync(int id)
    {
        var interview = await _context.Interviews.FindAsync(id);
        if (interview == null)
            return false;

        _context.Interviews.Remove(interview);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CompleteInterviewAsync(int id)
    {
        var interview = await _context.Interviews.FindAsync(id);
        if (interview == null)
            return false;

        interview.Status = "Completed";
        interview.CompletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }
}
