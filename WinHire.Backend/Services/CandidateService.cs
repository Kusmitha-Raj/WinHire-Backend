using WinHire.Backend.Models;
using WinHire.Backend.Repositories;

namespace WinHire.Backend.Services;

public class CandidateService : ICandidateService
{
    private readonly ICandidateRepository _repository;
    private readonly IEmailService _emailService;
    private readonly ILogger<CandidateService> _logger;

    public CandidateService(
        ICandidateRepository repository,
        IEmailService emailService,
        ILogger<CandidateService> logger)
    {
        _repository = repository;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<IEnumerable<Candidate>> GetAllCandidatesAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Candidate?> GetCandidateByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
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
