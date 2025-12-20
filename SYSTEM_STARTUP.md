# WinHire - Complete System Startup

## 🚀 Quick Start (All Components)

### 1. Start Backend API
```powershell
cd WinHire.Backend
dotnet run
```
**URL**: http://localhost:5000
**Swagger**: http://localhost:5000 (root)

### 2. Start All Agents
```powershell
cd WinHire.Agents
python agent_manager.py
```
Runs all 3 automation agents together.

### 3. Start Frontend
```powershell
cd WinHire.Frontend
npm run dev
```
**URL**: http://localhost:5173

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      WinHire System                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (React + TypeScript)                              │
│  └── http://localhost:5173                                  │
│       ↓ REST API                                            │
│                                                             │
│  Backend (.NET 8 + SQLite)                                  │
│  └── http://localhost:5000                                  │
│      ├── JWT Authentication                                 │
│      ├── CRUD APIs (Candidates, Jobs, Applications, etc.)   │
│      └── Agent Status Monitoring                            │
│       ↓ Polling (60s intervals)                             │
│                                                             │
│  Agents (Python)                                            │
│  ├── Intake Agent (assigns status)                          │
│  ├── Workflow Agent (moves through stages)                  │
│  └── Interview Agent (schedules interviews)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔑 Default Credentials

**Admin Account:**
- Email: `admin@winhire.com`
- Password: `admin123`

**Other Accounts:**
- Recruiter: `sarah.recruiter@winhire.com` / `password123`
- Manager: `mike.manager@winhire.com` / `password123`
- Panelist: `alex.panelist@winhire.com` / `password123`

## 📦 Sample Data

The backend includes pre-seeded data:
- ✅ 7 Users (Admin, Recruiters, Managers, Panelists)
- ✅ 7 Jobs (Various positions)
- ✅ 12 Candidates
- ✅ 12 Applications
- ✅ 7 Interviews
- ✅ 3 Feedbacks

## 🎯 Workflow Automation

Agents automatically process candidates every 60 seconds:

1. **Intake Agent**: New candidates → "Application Received"
2. **Workflow Agent**: 
   - "Application Received" → "Under Review"
   - "Under Review" → "Shortlisted"
3. **Interview Agent**: "Shortlisted" → "Interview Scheduled"

## 🔍 Monitoring

### Backend Health
```bash
curl http://localhost:5000/api/users
```

### Agent Status
```bash
curl http://localhost:5000/api/agentstatus/stats
```

### Frontend
Open browser: http://localhost:5173

## 🛑 Stopping Everything

Press `Ctrl+C` in each terminal window to gracefully shut down.

## 📝 API Documentation

Access Swagger UI at http://localhost:5000 for complete API documentation and testing.

## ⚡ One-Command Startup (PowerShell)

Run this script to start everything:

```powershell
.\START.ps1
```

Choose options:
1. Start Backend only
2. Start Frontend only
3. Start Agents
4. Install Dependencies
