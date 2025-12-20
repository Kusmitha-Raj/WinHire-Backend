# WinHire Agents

This folder contains the autonomous agents that manage candidate workflow automation.

## Agents

### 1. Candidate Intake Agent (`agent_intake.py`)
- **Runs every**: 1 minute
- **Function**: Assigns "Application Received" status to candidates without a status

### 2. Workflow Agent (`agent_workflow.py`)
- **Runs every**: 1 minute
- **Function**: 
  - Application Received → Under Review
  - Under Review → Shortlisted

### 3. Interview Scheduling Agent (`agent_interview.py`)
- **Runs every**: 1 minute
- **Function**: Shortlisted → Interview Scheduled

## Installation

```bash
pip install -r requirements.txt
```

## Running Individual Agents

```bash
# Intake Agent
python agent_intake.py

# Workflow Agent
python agent_workflow.py

# Interview Agent
python agent_interview.py
```

## Running All Agents

Open 3 separate terminals and run each agent in its own terminal for simultaneous execution.

## Configuration

- **API URL**: `http://localhost:5000/api`
- **Check Interval**: 60 seconds (1 minute)

Edit the agents directly to change these settings.

## Logs

All agents log their activity to the console with timestamps.
