using Microsoft.EntityFrameworkCore;
using WinHire.Backend.Data;
using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public class FeedbackService : IFeedbackService
{
    private readonly AppDbContext _context;

    public FeedbackService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Feedback>> GetAllFeedbackAsync()
    {
        return await _context.Feedbacks
            .Include(f => f.ProvidedBy)
            .Include(f => f.Interview)
            .Include(f => f.Application)
            .ToListAsync();
    }

    public async Task<Feedback?> GetFeedbackByIdAsync(int id)
    {
        return await _context.Feedbacks
            .Include(f => f.ProvidedBy)
            .Include(f => f.Interview)
            .Include(f => f.Application)
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<IEnumerable<Feedback>> GetFeedbackByInterviewIdAsync(int interviewId)
    {
        return await _context.Feedbacks
            .Include(f => f.ProvidedBy)
            .Where(f => f.InterviewId == interviewId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Feedback>> GetFeedbackByApplicationIdAsync(int applicationId)
    {
        return await _context.Feedbacks
            .Include(f => f.ProvidedBy)
            .Where(f => f.ApplicationId == applicationId)
            .ToListAsync();
    }

    public async Task<Feedback> CreateFeedbackAsync(Feedback feedback)
    {
        feedback.CreatedAt = DateTime.UtcNow;
        _context.Feedbacks.Add(feedback);
        await _context.SaveChangesAsync();
        return feedback;
    }

    public async Task<Feedback?> UpdateFeedbackAsync(int id, Feedback feedback)
    {
        var existing = await _context.Feedbacks.FindAsync(id);
        if (existing == null)
            return null;

        existing.TechnicalSkillsRating = feedback.TechnicalSkillsRating;
        existing.CommunicationRating = feedback.CommunicationRating;
        existing.ProblemSolvingRating = feedback.ProblemSolvingRating;
        existing.CulturalFitRating = feedback.CulturalFitRating;
        existing.OverallRating = feedback.OverallRating;
        existing.Comments = feedback.Comments;
        existing.Recommendation = feedback.Recommendation;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteFeedbackAsync(int id)
    {
        var feedback = await _context.Feedbacks.FindAsync(id);
        if (feedback == null)
            return false;

        _context.Feedbacks.Remove(feedback);
        await _context.SaveChangesAsync();
        return true;
    }
}
