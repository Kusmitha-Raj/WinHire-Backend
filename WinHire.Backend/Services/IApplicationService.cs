using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public interface IApplicationService
{
    Task<IEnumerable<Application>> GetAllApplicationsAsync();
    Task<Application?> GetApplicationByIdAsync(int id);
    Task<IEnumerable<Application>> GetApplicationsByJobIdAsync(int jobId);
    Task<IEnumerable<Application>> GetApplicationsByCandidateIdAsync(int candidateId);
    Task<Application> CreateApplicationAsync(Application application);
    Task<Application?> UpdateApplicationAsync(int id, Application application);
    Task<Application?> UpdateApplicationStatusAsync(int id, string status);
    Task<bool> DeleteApplicationAsync(int id);
}
