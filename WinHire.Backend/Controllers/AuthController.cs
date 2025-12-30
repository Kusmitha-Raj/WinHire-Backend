using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using WinHire.Backend.Models;
using WinHire.Backend.Services;
using System.Net.Http.Headers;

namespace WinHire.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;

    public AuthController(
        IUserService userService,
        ITokenService tokenService,
        ILogger<AuthController> logger,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory)
    {
        _userService = userService;
        _tokenService = tokenService;
        _logger = logger;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
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

    /// <summary>
    /// Get Microsoft OAuth authorization URL
    /// </summary>
    [HttpGet("microsoft/login")]
    public IActionResult GetMicrosoftLoginUrl()
    {
        try
        {
            var tenantId = _configuration["AzureAd:TenantId"] ?? "common";
            var clientId = _configuration["AzureAd:ClientId"];
            var redirectUri = _configuration["AzureAd:RedirectUri"];
            var scopes = "User.Read openid profile email";

            var authUrl = $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/authorize?" +
                $"client_id={clientId}" +
                $"&response_type=code" +
                $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                $"&response_mode=query" +
                $"&scope={Uri.EscapeDataString(scopes)}" +
                $"&state={Guid.NewGuid()}";

            return Ok(new { authUrl });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating Microsoft login URL");
            return StatusCode(500, new { message = "Failed to generate login URL" });
        }
    }

    /// <summary>
    /// Handle Microsoft OAuth callback
    /// </summary>
    [HttpPost("microsoft/callback")]
    public async Task<IActionResult> MicrosoftCallback([FromBody] MicrosoftCallbackRequest request)
    {
        try
        {
            var tokenResponse = await ExchangeCodeForToken(request.Code);
            var userInfo = await GetMicrosoftUserInfo(tokenResponse.AccessToken);

            var user = await _userService.GetUserByEmailAsync(userInfo.Email);
            
            if (user == null)
            {
                user = await _userService.CreateUserAsync(new User
                {
                    Name = userInfo.Name,
                    Email = userInfo.Email,
                    Role = "Panelist",
                    IsActive = true
                }, Guid.NewGuid().ToString()); // Random password for OAuth users
                
                _logger.LogInformation("Created new user via Microsoft OAuth: {Email}", user.Email);
            }

            // Update last login directly
            user.LastLogin = DateTime.UtcNow;
            await _userService.UpdateUserAsync(user.Id, user);
            
            var token = _tokenService.GenerateToken(user.Id, user.Email, user.Role);

            return Ok(new
            {
                token,
                user = new { user.Id, user.Name, user.Email, user.Role }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in Microsoft OAuth callback");
            return StatusCode(500, new { message = "OAuth authentication failed: " + ex.Message });
        }
    }

    private async Task<TokenResponse> ExchangeCodeForToken(string code)
    {
        var tenantId = _configuration["AzureAd:TenantId"] ?? "common";
        var clientId = _configuration["AzureAd:ClientId"];
        var clientSecret = _configuration["AzureAd:ClientSecret"];
        var redirectUri = _configuration["AzureAd:RedirectUri"];

        var tokenEndpoint = $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token";
        
        var parameters = new Dictionary<string, string>
        {
            { "client_id", clientId },
            { "client_secret", clientSecret },
            { "code", code },
            { "redirect_uri", redirectUri },
            { "grant_type", "authorization_code" }
        };

        var httpClient = _httpClientFactory.CreateClient();
        var response = await httpClient.PostAsync(tokenEndpoint, new FormUrlEncodedContent(parameters));
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var tokenData = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(content);

        return new TokenResponse
        {
            AccessToken = tokenData.GetProperty("access_token").GetString()!,
            RefreshToken = tokenData.TryGetProperty("refresh_token", out var rt) ? rt.GetString() : null,
            ExpiresIn = tokenData.GetProperty("expires_in").GetInt32()
        };
    }

    private async Task<MicrosoftUserInfo> GetMicrosoftUserInfo(string accessToken)
    {
        var httpClient = _httpClientFactory.CreateClient();
        httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        
        var response = await httpClient.GetAsync("https://graph.microsoft.com/v1.0/me");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var userData = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(content);

        return new MicrosoftUserInfo
        {
            Id = userData.GetProperty("id").GetString()!,
            Name = userData.GetProperty("displayName").GetString()!,
            Email = userData.GetProperty("userPrincipalName").GetString()!
        };
    }
}

public class MicrosoftCallbackRequest
{
    public string Code { get; set; } = string.Empty;
}

public class TokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string? RefreshToken { get; set; }
    public int ExpiresIn { get; set; }
}

public class MicrosoftUserInfo
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
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
