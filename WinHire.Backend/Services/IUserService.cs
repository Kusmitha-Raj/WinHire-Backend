using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public interface IUserService
{
    Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<IEnumerable<User>> GetUsersByRoleAsync(string role);
    Task<User> CreateUserAsync(User user, string password);
    Task<User?> UpdateUserAsync(int id, User user);
    Task<bool> DeleteUserAsync(int id);
    Task<bool> ValidatePasswordAsync(string email, string password);
    Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword);
}
