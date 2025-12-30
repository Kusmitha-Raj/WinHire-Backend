using WinHire.Backend.Models;
using WinHire.Backend.Repositories;
using WinHire.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace WinHire.Backend.Services;

public class CandidateService : ICandidateService
{
    private readonly ICandidateRepository _repository;
    private readonly IEmailService _emailService;
    private readonly ILogger<CandidateService> _logger;
    private readonly AppDbContext _context;

    public CandidateService(
        ICandidateRepository repository,
        IEmailService emailService,
        ILogger<CandidateService> logger,
        AppDbContext context)
    {
        _repository = repository;
        _emailService = emailService;
        _logger = logger;
        _context = context;
    }

    public async Task<IEnumerable<Candidate>> GetAllCandidatesAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Candidate?> GetCandidateByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<object?> GetCandidateDetailsAsync(int id)
    {
        var candidate = await _repository.GetByIdAsync(id);
        if (candidate == null)
            return null;

        // Get applications for this candidate
        var applications = await _context.Applications
            .Include(a => a.Job)
            .Include(a => a.Interviews)
                .ThenInclude(i => i.Interviewer)
            .Include(a => a.Interviews)
                .ThenInclude(i => i.Feedbacks)
                    .ThenInclude(f => f.ProvidedBy)
            .Include(a => a.Feedbacks)
                .ThenInclude(f => f.ProvidedBy)
            .Where(a => a.CandidateId == id)
            .ToListAsync();

        // Format the response
        var result = new
        {
            Candidate = candidate,
            Applications = applications.Select(app => new
            {
                app.Id,
                app.JobId,
                JobTitle = app.Job?.Title,
                app.Status,
                app.CurrentRound,
                app.AppliedDate,
                Interviews = app.Interviews.Select(interview => new
                {
                    interview.Id,
                    interview.Title,
                    interview.Type,
                    interview.ScheduledDateTime,
                    interview.Status,
                    interview.MeetingLink,
                    interview.Location,
                    Interviewer = interview.Interviewer != null ? new
                    {
                        interview.Interviewer.Id,
                        interview.Interviewer.Name,
                        interview.Interviewer.Email
                    } : null,
                    Feedbacks = interview.Feedbacks.Select(feedback => new
                    {
                        feedback.Id,
                        feedback.TechnicalSkillsRating,
                        feedback.ProblemSolvingRating,
                        feedback.CommunicationRating,
                        feedback.CulturalFitRating,
                        feedback.OverallRating,
                        feedback.Comments,
                        feedback.Recommendation,
                        feedback.CreatedAt,
                        ProvidedBy = feedback.ProvidedBy != null ? new
                        {
                            feedback.ProvidedBy.Id,
                            feedback.ProvidedBy.Name,
                            feedback.ProvidedBy.Email
                        } : null
                    }).ToList()
                }).OrderBy(i => i.ScheduledDateTime).ToList(),
                GeneralFeedbacks = app.Feedbacks
                    .Where(f => f.InterviewId == null)
                    .Select(feedback => new
                    {
                        feedback.Id,
                        feedback.Comments,
                        feedback.Recommendation,
                        feedback.CreatedAt,
                        ProvidedBy = feedback.ProvidedBy != null ? new
                        {
                            feedback.ProvidedBy.Id,
                            feedback.ProvidedBy.Name,
                            feedback.ProvidedBy.Email
                        } : null
                    }).ToList()
            }).ToList()
        };

        return result;
    }

    public async Task<IEnumerable<Candidate>> GetPanelistCandidatesAsync(int panelistId)
    {
        // Get all interviews where this panelist is the interviewer
        var interviews = await _context.Interviews
            .Where(i => i.InterviewerId == panelistId)
            .Include(i => i.Application)
                .ThenInclude(a => a!.Candidate)
            .ToListAsync();

        // Get unique candidates
        var candidates = interviews
            .Select(i => i.Application.Candidate)
            .GroupBy(c => c.Id)
            .Select(g => g.First())
            .ToList();

        return candidates;
    }

    public async Task<Candidate> CreateCandidateAsync(Candidate candidate)
    {
        // Set default status if not provided
        if (string.IsNullOrWhiteSpace(candidate.Status))
        {
            candidate.Status = "";
        }

        return await _repository.AddAsync(candidate);
    }

    public async Task<Candidate?> UpdateCandidateAsync(int id, Candidate candidate)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return null;

        var previousStatus = existing.Status;
        candidate.Id = id;
        
        var updated = await _repository.UpdateAsync(candidate);

        // Send email if status changed to Selected
        if (updated != null && 
            updated.Status == CandidateStatus.Selected && 
            previousStatus != CandidateStatus.Selected)
        {
            await _emailService.SendSelectionEmailAsync(
                updated.Name,
                updated.Email,
                updated.RoleApplied
            );
        }

        return updated;
    }

    public async Task<Candidate?> UpdateCandidateStatusAsync(int id, string status)
    {
        var candidate = await _repository.GetByIdAsync(id);
        if (candidate == null)
            return null;

        if (!CandidateStatus.AllStatuses.Contains(status) && !string.IsNullOrEmpty(status))
        {
            _logger.LogWarning("Invalid status provided: {Status}", status);
            throw new ArgumentException($"Invalid status. Allowed values: {string.Join(", ", CandidateStatus.AllStatuses)}");
        }

        var previousStatus = candidate.Status;
        candidate.Status = status;
        
        var updated = await _repository.UpdateAsync(candidate);

        // Send email if status changed to Selected
        if (updated != null && 
            status == CandidateStatus.Selected && 
            previousStatus != CandidateStatus.Selected)
        {
            await _emailService.SendSelectionEmailAsync(
                updated.Name,
                updated.Email,
                updated.RoleApplied
            );
        }

        return updated;
    }

    public async Task<bool> DeleteCandidateAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }
}
