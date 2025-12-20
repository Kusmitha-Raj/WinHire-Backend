namespace WinHire.Backend.Services;

public interface ITokenService
{
    string GenerateToken(int userId, string email, string role);
    int? ValidateToken(string token);
}
