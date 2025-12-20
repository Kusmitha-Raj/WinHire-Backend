using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public interface IFeedbackService
{
    Task<IEnumerable<Feedback>> GetAllFeedbackAsync();
    Task<Feedback?> GetFeedbackByIdAsync(int id);
    Task<IEnumerable<Feedback>> GetFeedbackByInterviewIdAsync(int interviewId);
    Task<IEnumerable<Feedback>> GetFeedbackByApplicationIdAsync(int applicationId);
    Task<Feedback> CreateFeedbackAsync(Feedback feedback);
    Task<Feedback?> UpdateFeedbackAsync(int id, Feedback feedback);
    Task<bool> DeleteFeedbackAsync(int id);
}
