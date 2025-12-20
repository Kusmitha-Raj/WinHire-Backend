# WinHire Agents - Quick Start

## Running All Agents Together

### Option 1: Unified Agent Manager (Recommended)
Run all agents in a single process with coordinated logging:

```powershell
cd WinHire.Agents
python agent_manager.py
```

This will start:
- **Intake Agent** - Assigns "Application Received" status
- **Workflow Agent** - Moves through review stages
- **Interview Agent** - Schedules interviews

All agents run in parallel with synchronized logging.

### Option 2: Individual Agents
Run each agent in separate terminals:

```powershell
# Terminal 1
python agent_intake.py

# Terminal 2
python agent_workflow.py

# Terminal 3
python agent_interview.py
```

## Agent Flow

```
New Candidate (no status)
    ↓ [Intake Agent - 60s]
Application Received
    ↓ [Workflow Agent - 60s]
Under Review
    ↓ [Workflow Agent - 60s]
Shortlisted
    ↓ [Interview Agent - 60s]
Interview Scheduled
```

## Configuration

- **API URL**: `http://localhost:5000/api`
- **Check Interval**: 60 seconds
- **Backend**: Must be running first

## Agent Status API

The backend now includes agent monitoring endpoints:

```bash
# Get all agent statuses
GET http://localhost:5000/api/agentstatus

# Get agent statistics
GET http://localhost:5000/api/agentstatus/stats
```

## Features

✅ Multi-threaded execution
✅ Coordinated logging
✅ Graceful shutdown (Ctrl+C)
✅ Error handling and retry
✅ Status monitoring via API
✅ Real-time activity tracking

## Monitoring

Check agent activity in real-time:
- View logs in console
- Query `/api/agentstatus/stats` endpoint
- Monitor processed candidate counts
