using MailKit.Net.Smtp;
using MimeKit;

namespace WinHire.Backend.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendSelectionEmailAsync(string candidateName, string candidateEmail, string roleApplied)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _configuration["Email:FromName"] ?? "WinHire Team",
                _configuration["Email:FromAddress"] ?? "noreply@winhire.com"
            ));
            message.To.Add(new MailboxAddress(candidateName, candidateEmail));
            message.Subject = "Congratulations – You Have Been Selected!";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <html>
                    <body style='font-family: Arial, sans-serif;'>
                        <h2>Hello {candidateName},</h2>
                        <p>Congratulations! You have been selected for the role: <strong>{roleApplied}</strong>.</p>
                        <p>Our team will contact you shortly with next steps.</p>
                        <br/>
                        <p>Regards,<br/>WinHire Team</p>
                    </body>
                    </html>
                ",
                TextBody = $@"
Hello {candidateName},

Congratulations! You have been selected for the role: {roleApplied}.
Our team will contact you shortly with next steps.

Regards,
WinHire Team
                "
            };

            message.Body = bodyBuilder.ToMessageBody();

            // Use SMTP settings from configuration
            var smtpHost = _configuration["Email:SmtpHost"];
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var smtpUser = _configuration["Email:SmtpUser"];
            var smtpPass = _configuration["Email:SmtpPassword"];

            // If SMTP is not configured, log the email instead
            if (string.IsNullOrEmpty(smtpHost))
            {
                _logger.LogInformation(
                    "Email would be sent to {Email} - Subject: {Subject}\nBody: Hello {Name}, you are selected for {Role}",
                    candidateEmail, message.Subject, candidateName, roleApplied
                );
                _logger.LogWarning("SMTP not configured. Email logged but not sent.");
                return;
            }

            using var client = new SmtpClient();
            await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            
            if (!string.IsNullOrEmpty(smtpUser) && !string.IsNullOrEmpty(smtpPass))
            {
                await client.AuthenticateAsync(smtpUser, smtpPass);
            }

            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Selection email sent successfully to {Email} for role {Role}", 
                candidateEmail, roleApplied);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", candidateEmail);
            // Don't throw - we don't want email failures to break the status update
        }
    }
}
