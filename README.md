# 🎯 WinHire - Complete Candidate Management System

> **Production-ready full-stack application with Backend API + Frontend UI + Intelligent Agents + Email Notifications**

## 📋 Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

**WinHire** is an enterprise-grade candidate management system that automates the recruitment workflow from application to selection. The system features:

- ✅ **RESTful Backend API** (ASP.NET Core 8)
- ✅ **Modern React Frontend** (React 19 + Tailwind CSS)
- ✅ **Intelligent Automation Agents** (Python)
- ✅ **Email Notifications** (SMTP/MailKit)
- ✅ **Real-time Status Updates**
- ✅ **Complete CRUD Operations**

---

## 🏗️ System Architecture

```
WinHire/
├── WinHire.Backend/        # ASP.NET Core Web API
│   ├── Controllers/        # API endpoints
│   ├── Services/           # Business logic & email
│   ├── Repositories/       # Data access layer
│   ├── Models/             # Entity models
│   └── Data/               # EF Core DbContext
│
├── WinHire.Frontend/       # React + Tailwind UI
│   ├── src/
│   │   ├── api/            # API integration
│   │   ├── pages/          # React components
│   │   └── App.tsx         # Main app
│   └── package.json
│
└── WinHire.Agents/         # Python automation agents
    ├── agent_intake.py     # Sets initial status
    ├── agent_workflow.py   # Progresses candidates
    └── agent_interview.py  # Schedules interviews
```

---

## 🛠️ Technologies

### Backend
- .NET 8 Web API
- Entity Framework Core 8
- SQLite Database
- MailKit (Email)
- Swagger/OpenAPI

### Frontend
- React 19
- TypeScript
- Tailwind CSS 3
- Axios
- Vite

### Agents
- Python 3.9+
- Requests library
- Logging

---

## ⚙️ Prerequisites

Before you begin, ensure you have installed:

- **[.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)** (for Backend)
- **[Node.js 18+](https://nodejs.org/)** (for Frontend)
- **[Python 3.9+](https://www.python.org/downloads/)** (for Agents)
- **Git** (optional)

### Verify Installations

```powershell
dotnet --version    # Should show 8.x.x
node --version      # Should show 18.x.x or higher
npm --version       # Should show 9.x.x or higher
python --version    # Should show 3.9.x or higher
```

---

## 🚀 Quick Start

### Option 1: Run Everything at Once

Open **3 separate PowerShell terminals** in the `WinHire` directory:

**Terminal 1 - Backend:**
```powershell
cd WinHire.Backend
dotnet run
```

**Terminal 2 - Frontend:**
```powershell
cd WinHire.Frontend
npm install
npm run dev
```

**Terminal 3 - Agents (choose one):**
```powershell
cd WinHire.Agents
pip install -r requirements.txt

# Then run ONE of these:
python agent_intake.py      # Intake agent
python agent_workflow.py    # Workflow agent
python agent_interview.py   # Interview agent
```

### Access the Application

- **Frontend UI:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Swagger Docs:** http://localhost:5000

---

## 📖 Detailed Setup

### 1️⃣ Backend Setup (WinHire.Backend)

```powershell
# Navigate to backend directory
cd WinHire.Backend

# Restore dependencies
dotnet restore

# Build the project
dotnet build

# Run the API
dotnet run
```

The API will start at: **http://localhost:5000**

#### Database

- **Type:** SQLite (file-based, no installation needed)
- **File:** `winhire.db` (auto-created on first run)
- **Migrations:** Automatic via `EnsureCreated()`

#### Email Configuration (Optional)

Edit `appsettings.json` to configure SMTP:

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

> **Note:** If SMTP is not configured, emails will be logged to console instead.

---

### 2️⃣ Frontend Setup (WinHire.Frontend)

```powershell
# Navigate to frontend directory
cd WinHire.Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The UI will start at: **http://localhost:5173**

#### Build for Production

```powershell
npm run build
npm run preview
```

---

### 3️⃣ Agents Setup (WinHire.Agents)

```powershell
# Navigate to agents directory
cd WinHire.Agents

# Install Python dependencies
pip install -r requirements.txt

# Run individual agents
python agent_intake.py      # Agent 1: Intake
python agent_workflow.py    # Agent 2: Workflow
python agent_interview.py   # Agent 3: Interview
```

#### Agent Descriptions

| Agent | Function | Trigger | Action |
|-------|----------|---------|--------|
| **Intake** | Initial processing | No status | Set to "Application Received" |
| **Workflow** | Status progression | Application Received → Under Review | Under Review → Shortlisted |
| **Interview** | Schedule interviews | Shortlisted | Set to "Interview Scheduled" |

All agents run every **60 seconds** (configurable in code).

---

## ✨ Features

### Candidate Status Workflow

```
[No Status] 
    ↓ (Intake Agent)
[Application Received] 
    ↓ (Workflow Agent)
[Under Review] 
    ↓ (Workflow Agent)
[Shortlisted] 
    ↓ (Interview Agent)
[Interview Scheduled] 
    ↓ (Manual)
[Selected] ✅ → Email Sent!
    OR
[Rejected] ❌
```

### Status Badge Colors

- **Gray** - Application Received
- **Blue** - Under Review
- **Yellow** - Shortlisted
- **Purple** - Interview Scheduled
- **Green** - Selected ✅
- **Red** - Rejected ❌

### Email Notification

When a candidate's status is changed to **"Selected"**, the system automatically:

1. ✉️ Sends congratulations email to candidate
2. 📝 Logs email sent confirmation
3. 🔄 Updates UI immediately

**Email Template:**
```
Subject: Congratulations – You Have Been Selected!

Hello [Name],

Congratulations! You have been selected for the role: [Role].
Our team will contact you shortly with next steps.

Regards,
WinHire Team
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Get All Candidates
```http
GET /api/candidates
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "roleApplied": "Software Engineer",
    "status": "Application Received",
    "createdOn": "2025-12-20T10:30:00Z"
  }
]
```

#### Get Candidate by ID
```http
GET /api/candidates/{id}
```

#### Create Candidate
```http
POST /api/candidates
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "987-654-3210",
  "roleApplied": "Product Manager",
  "status": ""
}
```

#### Update Candidate
```http
PUT /api/candidates/{id}
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "987-654-3210",
  "roleApplied": "Senior Product Manager",
  "status": "Under Review"
}
```

#### Update Status Only
```http
PUT /api/candidates/{id}/status
Content-Type: application/json

{
  "status": "Selected"
}
```

#### Delete Candidate
```http
DELETE /api/candidates/{id}
```

### Swagger UI

Full interactive API documentation available at:
```
http://localhost:5000
```

---

## 🎨 Frontend Features

### Dashboard Statistics

- **Total Candidates**
- **Count by Status** (8 categories)
- **Real-time Updates**
- **Color-coded Badges**

### Candidate Management

- ➕ **Add New Candidate** - Quick form with validation
- 🔄 **Update Status** - Dropdown with all statuses
- 🗑️ **Delete Candidate** - With confirmation
- 🔍 **View Details** - Complete candidate info
- ♻️ **Refresh** - Manual data reload

### UI/UX

- 🎨 **Modern Tailwind Design**
- 📱 **Fully Responsive**
- ⚡ **Fast Loading**
- 🌈 **Gradient Backgrounds**
- 🎯 **Intuitive Interface**

---

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Port 5000 already in use
```powershell
# Edit appsettings.json and change:
"Urls": "http://localhost:5001"
```

**Problem:** Database locked
```powershell
# Delete database and restart:
Remove-Item winhire.db
dotnet run
```

**Problem:** CORS errors
```
Solution: Ensure frontend URL is in CORS policy (Program.cs)
Already configured for localhost:5173 and localhost:3000
```

### Frontend Issues

**Problem:** Cannot connect to API
```
Solution: Verify backend is running at http://localhost:5000
Check src/api/candidateApi.ts for correct API_BASE_URL
```

**Problem:** Tailwind styles not working
```powershell
# Reinstall dependencies
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

**Problem:** Port 5173 already in use
```powershell
# Vite will automatically use next available port (5174, 5175, etc.)
# Or specify a custom port in vite.config.ts
```

### Agent Issues

**Problem:** Cannot connect to API
```
Solution: Ensure backend is running first
Agents need backend at http://localhost:5000/api
```

**Problem:** Python package errors
```powershell
# Upgrade pip and reinstall
python -m pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

**Problem:** Agent not updating candidates
```
Check logs - agents print detailed status
Verify candidates exist in database
Ensure statuses match expected values
```

---

## 📊 System Flow

### Complete Workflow Example

1. **User adds candidate** via Frontend
   - Status: "" (empty)

2. **Intake Agent** (runs every 60s)
   - Detects empty status
   - Updates to: "Application Received"

3. **Workflow Agent** (runs every 60s)
   - Sees "Application Received"
   - Updates to: "Under Review"
   - Next cycle: "Under Review" → "Shortlisted"

4. **Interview Agent** (runs every 60s)
   - Sees "Shortlisted"
   - Updates to: "Interview Scheduled"

5. **HR manually updates** to "Selected"
   - Backend triggers email
   - Candidate receives congratulations email
   - Frontend shows green badge

---

## 🏆 Best Practices

### Development

- Keep **all 3 terminals open** while developing
- Backend **must start first** before frontend/agents
- Use **Swagger** for API testing
- Check **console logs** for debugging

### Production

- Configure **real SMTP** credentials
- Use **SQL Server** instead of SQLite
- Enable **HTTPS**
- Add **authentication/authorization**
- Implement **rate limiting**
- Add **input validation**

---

## 📝 Configuration Summary

| Component | URL | Port | Config File |
|-----------|-----|------|-------------|
| Backend | http://localhost:5000 | 5000 | appsettings.json |
| Frontend | http://localhost:5173 | 5173 | vite.config.ts |
| Agents | N/A | N/A | Hardcoded in .py files |

---

## 🤝 Contributing

This is a demonstration project. Feel free to:

- Add authentication
- Implement file uploads
- Add more agents
- Enhance UI/UX
- Add unit tests
- Improve error handling

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 🎓 Learning Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Entity Framework Core](https://docs.microsoft.com/ef/core)

---

## ✅ Checklist

- [ ] Install .NET 8 SDK
- [ ] Install Node.js 18+
- [ ] Install Python 3.9+
- [ ] Clone/Download WinHire project
- [ ] Start Backend (`dotnet run`)
- [ ] Start Frontend (`npm run dev`)
- [ ] Start Agents (`python agent_*.py`)
- [ ] Open http://localhost:5173
- [ ] Add a candidate
- [ ] Watch agents update status
- [ ] Change status to "Selected"
- [ ] Check email logs

---

## 🎯 Project Highlights

✨ **Enterprise Architecture** - Layered design with separation of concerns  
✨ **Type Safety** - TypeScript + C# strong typing  
✨ **Modern UI** - Tailwind CSS with responsive design  
✨ **Automation** - Intelligent agents for workflow  
✨ **Email Integration** - Automatic notifications  
✨ **Real-time** - Live status updates  
✨ **Production Ready** - Error handling, logging, CORS  
✨ **API First** - RESTful with Swagger docs  

---

**Built with ❤️ for enterprise recruitment automation**

**WinHire** - *Where talent meets opportunity* 🚀
