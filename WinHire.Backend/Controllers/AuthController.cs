using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using WinHire.Backend.Models;
using WinHire.Backend.Services;

namespace WinHire.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IUserService userService,
        ITokenService tokenService,
        ILogger<AuthController> logger)
    {
        _userService = userService;
        _tokenService = tokenService;
        _logger = logger;
    }

    /// <summary>
    /// User login
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var isValid = await _userService.ValidatePasswordAsync(request.Email, request.Password);
            if (!isValid)
                return Unauthorized(new { message = "Invalid email or password" });

            var user = await _userService.GetUserByEmailAsync(request.Email);
            if (user == null || !user.IsActive)
                return Unauthorized(new { message = "Account is inactive" });

            var token = _tokenService.GenerateToken(user.Id, user.Email, user.Role);

            _logger.LogInformation("User {Email} logged in successfully", user.Email);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role,
                    user.Department
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login error for {Email}", request.Email);
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    /// <summary>
    /// User registration
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Role = request.Role,
                Department = request.Department
            };

            var createdUser = await _userService.CreateUserAsync(user, request.Password);

            return Ok(new
            {
                message = "User registered successfully",
                user = new
                {
                    createdUser.Id,
                    createdUser.Name,
                    createdUser.Email,
                    createdUser.Role
                }
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Registration error");
            return StatusCode(500, new { message = "An error occurred during registration" });
        }
    }

    /// <summary>
    /// Change password
    /// </summary>
    [HttpPost("change-password")]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var success = await _userService.ChangePasswordAsync(
                request.UserId,
                request.OldPassword,
                request.NewPassword);

            if (!success)
                return BadRequest(new { message = "Old password is incorrect" });

            return Ok(new { message = "Password changed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Password change error");
            return StatusCode(500, new { message = "An error occurred while changing password" });
        }
    }
}

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = UserRoles.Recruiter;

    public string? Department { get; set; }
}

public class ChangePasswordRequest
{
    public int UserId { get; set; }
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
