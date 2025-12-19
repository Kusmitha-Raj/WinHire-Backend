1. **Core Master Tables**
2. **Relationship & Workflow Tables**
3. **Interview & Scheduling Tables**
4. **Agent & AI Audit Tables**
5. **Decision & Communication Tables**
6. **Important Keys, Constraints & Indexing Notes**

---

# 1. Core Master Tables

## 1.1 Employee

Represents all internal users (manager, recruiter, interviewer).

```sql
Employee (
    employee_id           UNIQUEIDENTIFIER PK,
    employee_code         NVARCHAR(50) UNIQUE,
    full_name             NVARCHAR(200),
    email                 NVARCHAR(200) UNIQUE,
    department            NVARCHAR(100),
    role                  NVARCHAR(50),      -- Manager / Recruiter / Interviewer / Admin
    experience_years      INT,
    is_active             BIT,
    created_at            DATETIME2,
    updated_at            DATETIME2
)
```

---

## 1.2 InterviewerProfile

Created when an employee enrolls as interviewer.

```sql
InterviewerProfile (
    interviewer_profile_id UNIQUEIDENTIFIER PK,
    employee_id            UNIQUEIDENTIFIER FK → Employee(employee_id),
    seniority_band         NVARCHAR(50),  -- SDT/SDE/SSDE/Lead/Architect/etc
    max_interviews_per_week INT,
    is_active              BIT,
    created_at             DATETIME2
)
```

---

## 1.3 InterviewerSkill

Normalized skills (important for Agent 1 ranking).

```sql
InterviewerSkill (
    interviewer_skill_id UNIQUEIDENTIFIER PK,
    interviewer_profile_id UNIQUEIDENTIFIER FK → InterviewerProfile,
    skill_name             NVARCHAR(100)
)
```

---

## 1.4 Candidate

Candidate master data.

```sql
Candidate (
    candidate_id          UNIQUEIDENTIFIER PK,
    full_name             NVARCHAR(200),
    email                 NVARCHAR(200),
    phone                 NVARCHAR(50),
    experience_years      INT,
    skills                NVARCHAR(500),
    cv_blob_url           NVARCHAR(500),
    created_by            UNIQUEIDENTIFIER FK → Employee,
    created_at            DATETIME2
)
```

---

# 2. Position & Assignment Tables

## 2.1 Position

Job opening owned by a manager.

```sql
Position (
    position_id           UNIQUEIDENTIFIER PK,
    title                 NVARCHAR(200),
    level_band            NVARCHAR(50),
    required_skills       NVARCHAR(MAX),
    job_description       NVARCHAR(MAX),
    headcount             INT,
    manager_owner_id      UNIQUEIDENTIFIER FK → Employee,
    status                NVARCHAR(50),  -- Open / OnHold / Closed
    created_at            DATETIME2
)
```

---

## 2.2 RecruiterAssignment

Supports **multiple recruiters per position**.

```sql
RecruiterAssignment (
    recruiter_assignment_id UNIQUEIDENTIFIER PK,
    position_id             UNIQUEIDENTIFIER FK → Position,
    recruiter_id            UNIQUEIDENTIFIER FK → Employee,
    assigned_at             DATETIME2
)
```

---

# 3. Candidate Pipeline Tables

## 3.1 PositionCandidate

Tracks **pipeline stage per position**.

```sql
PositionCandidate (
    position_candidate_id UNIQUEIDENTIFIER PK,
    position_id           UNIQUEIDENTIFIER FK → Position,
    candidate_id          UNIQUEIDENTIFIER FK → Candidate,
    current_stage         NVARCHAR(50),  -- Screening/Round1/Round2/Offer/Hired/Rejected
    stage_updated_at      DATETIME2,
    created_at            DATETIME2,
    UNIQUE(position_id, candidate_id)
)
```

---

# 4. Scheduling & Interview Tables

## 4.1 Slot

Interviewer availability.

```sql
Slot (
    slot_id               UNIQUEIDENTIFIER PK,
    interviewer_profile_id UNIQUEIDENTIFIER FK → InterviewerProfile,
    start_time            DATETIME2,
    end_time              DATETIME2,
    status                NVARCHAR(20),  -- Available / Booked / Cancelled
    created_at            DATETIME2
)
```

---

## 4.2 Interview

One interview round (can have multiple interviewers).

```sql
Interview (
    interview_id          UNIQUEIDENTIFIER PK,
    position_candidate_id UNIQUEIDENTIFIER FK → PositionCandidate,
    round_number          INT,
    scheduled_start       DATETIME2,
    scheduled_end         DATETIME2,
    status                NVARCHAR(50),  -- Scheduled / Completed / Cancelled
    created_at            DATETIME2
)
```

---

## 4.3 InterviewInterviewer

Many-to-many between Interview and Interviewers.

```sql
InterviewInterviewer (
    interview_interviewer_id UNIQUEIDENTIFIER PK,
    interview_id             UNIQUEIDENTIFIER FK → Interview,
    interviewer_profile_id   UNIQUEIDENTIFIER FK → InterviewerProfile,
    slot_id                  UNIQUEIDENTIFIER FK → Slot
)
```

---

# 5. Feedback & Decision Tables

## 5.1 Feedback

One feedback **per interviewer per interview**.

```sql
Feedback (
    feedback_id            UNIQUEIDENTIFIER PK,
    interview_id           UNIQUEIDENTIFIER FK → Interview,
    interviewer_profile_id UNIQUEIDENTIFIER FK → InterviewerProfile,
    rating_technical       INT,
    rating_problem_solving INT,
    rating_communication   INT,
    comments               NVARCHAR(MAX),
    go_no_go               NVARCHAR(10),  -- Go / No-Go
    submitted_at           DATETIME2,
    UNIQUE(interview_id, interviewer_profile_id)
)
```

---

## 5.2 Decision

Final human + agent decision tracking.

```sql
Decision (
    decision_id            UNIQUEIDENTIFIER PK,
    position_candidate_id  UNIQUEIDENTIFIER FK → PositionCandidate,
    agent_recommendation   NVARCHAR(50),  -- Good Fit / Not Fit
    manager_decision       NVARCHAR(50),  -- Approve / Reject / Hold
    final_status           NVARCHAR(50),
    decided_by             UNIQUEIDENTIFIER FK → Employee,
    decided_at             DATETIME2
)
```

---

# 6. Agent & AI Audit Tables (Critical)

## 6.1 AgentSuggestion

**Single table for all agents** (clean + auditable).

```sql
AgentSuggestion (
    agent_suggestion_id    UNIQUEIDENTIFIER PK,
    agent_type             NVARCHAR(50),   -- Agent1_RoleMatch / Agent2_Slot / Agent3_Feedback / Agent4_Email
    reference_entity       NVARCHAR(50),   -- Position / Interview / PositionCandidate
    reference_id           UNIQUEIDENTIFIER,
    input_context_json     NVARCHAR(MAX),
    suggestion_json        NVARCHAR(MAX),
    explanation_text       NVARCHAR(MAX),
    approval_status        NVARCHAR(50),   -- Pending / Approved / Rejected
    approved_by            UNIQUEIDENTIFIER FK → Employee,
    approved_at            DATETIME2,
    created_at             DATETIME2
)
```

---

# 7. Email Communication Tables

## 7.1 CandidateEmail

Tracks **human-approved emails**.

```sql
CandidateEmail (
    candidate_email_id     UNIQUEIDENTIFIER PK,
    position_candidate_id  UNIQUEIDENTIFIER FK → PositionCandidate,
    agent_suggestion_id    UNIQUEIDENTIFIER FK → AgentSuggestion,
    email_type             NVARCHAR(50), -- Invite / NextRound / Offer / Rejection
    email_subject          NVARCHAR(200),
    email_body             NVARCHAR(MAX),
    approved_by            UNIQUEIDENTIFIER FK → Employee,
    approved_at            DATETIME2,
    sent_at                DATETIME2,
    delivery_status        NVARCHAR(50)
)
```

---

# 8. Key Constraints & Design Notes (Important)

### 🔑 Primary Design Choices

* **All AI output is immutable** → stored in `AgentSuggestion`
* **Humans always approve** → `approval_status` enforced
* **Slots are single-book** → enforce via Slot.status + FK
* **No agent auto-updates PositionCandidate.stage**

### 🔒 Critical Constraints

* `UNIQUE(position_id, candidate_id)` → no duplicate pipelines
* `UNIQUE(interview_id, interviewer_profile_id)` → one feedback per interviewer
* Slot can be booked only once

### ⚡ Indexing Recommendations

* `PositionCandidate(position_id, current_stage)`
* `Slot(interviewer_profile_id, start_time, status)`
* `AgentSuggestion(agent_type, approval_status)`
* `Interview(scheduled_start)`
