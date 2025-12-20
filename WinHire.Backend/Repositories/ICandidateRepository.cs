using WinHire.Backend.Models;

namespace WinHire.Backend.Repositories;

public interface ICandidateRepository
{
    Task<IEnumerable<Candidate>> GetAllAsync();
    Task<Candidate?> GetByIdAsync(int id);
    Task<Candidate> AddAsync(Candidate candidate);
    Task<Candidate?> UpdateAsync(Candidate candidate);
    Task<bool> DeleteAsync(int id);
}
