# WinHire Backend

ASP.NET Core 8 Web API for candidate management with email notifications.

## Features

- RESTful API with Swagger documentation
- Entity Framework Core with SQLite
- Email notifications via MailKit/SMTP
- Layered architecture (Controller → Service → Repository)
- Complete error handling and logging
- CORS enabled for frontend

## Quick Start

```powershell
# Restore and run
dotnet restore
dotnet run
```

Access:
- **API:** http://localhost:5000/api/candidates
- **Swagger:** http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/candidates` | Get all candidates |
| GET | `/api/candidates/{id}` | Get candidate by ID |
| POST | `/api/candidates` | Create candidate |
| PUT | `/api/candidates/{id}` | Update candidate |
| PUT | `/api/candidates/{id}/status` | Update status only |
| DELETE | `/api/candidates/{id}` | Delete candidate |

## Database

- **Type:** SQLite
- **File:** `winhire.db` (auto-created)
- **Migrations:** Automatic via EnsureCreated()

## Email Configuration

Edit `appsettings.json`:

```json
{
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "SmtpUser": "your-email@gmail.com",
    "SmtpPassword": "your-app-password"
  }
}
```

If not configured, emails are logged to console.

## Project Structure

```
WinHire.Backend/
├── Controllers/        # API endpoints
├── Services/           # Business logic & email service
├── Repositories/       # Data access layer
├── Models/             # Entity models
├── Data/               # DbContext
└── Program.cs          # App configuration
```

## Candidate Status Values

- Application Received
- Under Review
- Shortlisted
- Interview Scheduled
- Selected (triggers email)
- Rejected
