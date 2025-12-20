using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public interface ICandidateService
{
    Task<IEnumerable<Candidate>> GetAllCandidatesAsync();
    Task<Candidate?> GetCandidateByIdAsync(int id);
    Task<Candidate> CreateCandidateAsync(Candidate candidate);
    Task<Candidate?> UpdateCandidateAsync(int id, Candidate candidate);
    Task<Candidate?> UpdateCandidateStatusAsync(int id, string status);
    Task<bool> DeleteCandidateAsync(int id);
}
