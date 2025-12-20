using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public interface IInterviewService
{
    Task<IEnumerable<Interview>> GetAllInterviewsAsync();
    Task<Interview?> GetInterviewByIdAsync(int id);
    Task<IEnumerable<Interview>> GetInterviewsByApplicationIdAsync(int applicationId);
    Task<IEnumerable<Interview>> GetInterviewsByInterviewerIdAsync(int interviewerId);
    Task<Interview> CreateInterviewAsync(Interview interview);
    Task<Interview?> UpdateInterviewAsync(int id, Interview interview);
    Task<Interview?> UpdateInterviewStatusAsync(int id, string status);
    Task<bool> DeleteInterviewAsync(int id);
    Task<bool> CompleteInterviewAsync(int id);
}
