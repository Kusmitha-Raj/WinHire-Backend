using Microsoft.EntityFrameworkCore;
using WinHire.Backend.Data;
using WinHire.Backend.Models;

namespace WinHire.Backend.Repositories;

public class CandidateRepository : ICandidateRepository
{
    private readonly AppDbContext _context;
    private readonly ILogger<CandidateRepository> _logger;

    public CandidateRepository(AppDbContext context, ILogger<CandidateRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<Candidate>> GetAllAsync()
    {
        try
        {
            return await _context.Candidates
                .OrderByDescending(c => c.CreatedOn)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all candidates");
            throw;
        }
    }

    public async Task<Candidate?> GetByIdAsync(int id)
    {
        try
        {
            return await _context.Candidates.FindAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving candidate with ID {Id}", id);
            throw;
        }
    }

    public async Task<Candidate> AddAsync(Candidate candidate)
    {
        try
        {
            candidate.CreatedOn = DateTime.UtcNow;
            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Candidate {Name} added successfully with ID {Id}", candidate.Name, candidate.Id);
            return candidate;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding candidate {Name}", candidate.Name);
            throw;
        }
    }

    public async Task<Candidate?> UpdateAsync(Candidate candidate)
    {
        try
        {
            var existing = await _context.Candidates.FindAsync(candidate.Id);
            if (existing == null)
                return null;

            existing.Name = candidate.Name;
            existing.Email = candidate.Email;
            existing.Phone = candidate.Phone;
            existing.RoleApplied = candidate.RoleApplied;
            existing.Status = candidate.Status;

            await _context.SaveChangesAsync();
            _logger.LogInformation("Candidate {Id} updated successfully", candidate.Id);
            return existing;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating candidate {Id}", candidate.Id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            var candidate = await _context.Candidates.FindAsync(id);
            if (candidate == null)
                return false;

            _context.Candidates.Remove(candidate);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Candidate {Id} deleted successfully", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting candidate {Id}", id);
            throw;
        }
    }
}
