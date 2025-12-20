using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public interface IJobService
{
    Task<IEnumerable<Job>> GetAllJobsAsync();
    Task<IEnumerable<Job>> GetActiveJobsAsync();
    Task<Job?> GetJobByIdAsync(int id);
    Task<Job> CreateJobAsync(Job job);
    Task<Job?> UpdateJobAsync(int id, Job job);
    Task<bool> DeleteJobAsync(int id);
    Task<bool> CloseJobAsync(int id);
}
