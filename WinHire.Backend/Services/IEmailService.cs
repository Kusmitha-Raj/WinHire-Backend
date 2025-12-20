namespace WinHire.Backend.Services;

public interface IEmailService
{
    Task SendSelectionEmailAsync(string candidateName, string candidateEmail, string roleApplied);
}
