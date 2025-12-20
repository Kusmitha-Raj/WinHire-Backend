using Microsoft.EntityFrameworkCore;
using WinHire.Backend.Data;
using WinHire.Backend.Models;

namespace WinHire.Backend.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly ILogger<UserService> _logger;

    public UserService(AppDbContext context, ILogger<UserService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _context.Users.Where(u => u.IsActive).ToListAsync();
    }

    public async Task<IEnumerable<User>> GetUsersByRoleAsync(string role)
    {
        return await _context.Users.Where(u => u.Role == role && u.IsActive).ToListAsync();
    }

    public async Task<User> CreateUserAsync(User user, string password)
    {
        // Check if email already exists
        var existingUser = await GetUserByEmailAsync(user.Email);
        if (existingUser != null)
            throw new InvalidOperationException("Email already exists");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
        user.CreatedAt = DateTime.UtcNow;
        user.IsActive = true;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User created: {Email} with role {Role}", user.Email, user.Role);
        return user;
    }

    public async Task<User?> UpdateUserAsync(int id, User user)
    {
        var existing = await _context.Users.FindAsync(id);
        if (existing == null)
            return null;

        existing.Name = user.Name;
        existing.Email = user.Email;
        existing.Role = user.Role;
        existing.Department = user.Department;
        existing.IsActive = user.IsActive;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return false;

        // Soft delete
        user.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ValidatePasswordAsync(string email, string password)
    {
        var user = await GetUserByEmailAsync(email);
        if (user == null || !user.IsActive)
            return false;

        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }

    public async Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return false;

        if (!BCrypt.Net.BCrypt.Verify(oldPassword, user.PasswordHash))
            return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _context.SaveChangesAsync();
        return true;
    }
}
