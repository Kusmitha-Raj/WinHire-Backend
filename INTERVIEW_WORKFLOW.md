# Interview Feedback System - User Workflow

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CANDIDATE DETAILS PAGE                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  CANDIDATE INFO                                                      │
│  ├─ Name, Email, Phone                                              │
│  ├─ Role Applied                                                    │
│  └─ Current Status Badge                                            │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│  APPLICATION SECTION                                                 │
│  ├─ Job Title                                                       │
│  ├─ Status & Current Round                                          │
│  └─ DECISION BUTTONS (Hiring Manager)                               │
│     ├─ [Select] ──→ Status: Selected                                │
│     ├─ [Reject] ──→ Status: Rejected                                │
│     └─ [On Hold] ──→ Status: OnHold                                 │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│  INTERVIEW ROUNDS                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [+ Schedule Interview] Button                               │   │
│  │     ↓                                                        │   │
│  │  ┌──────────────────────────────────────────────┐           │   │
│  │  │  SCHEDULING FORM (Modal)                     │           │   │
│  │  │  ├─ Title                                    │           │   │
│  │  │  ├─ Type (Technical/HR/Managerial/Final)    │           │   │
│  │  │  ├─ Round (Auto-calculated)                 │           │   │
│  │  │  ├─ Date & Time                              │           │   │
│  │  │  ├─ ⭐ Panelists (Multi-select dropdown)    │           │   │
│  │  │  ├─ Meeting Link                             │           │   │
│  │  │  ├─ Location                                 │           │   │
│  │  │  └─ Notes                                    │           │   │
│  │  └──────────────────────────────────────────────┘           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  ROUND 1: Technical Interview                             │     │
│  │  ├─ Status: Completed                                     │     │
│  │  ├─ Date/Time: Jan 20, 2025 10:00 AM                     │     │
│  │  ├─ Interviewer: John Doe                                │     │
│  │  ├─ Panelists: 2 assigned                                │     │
│  │  ├─ [Join Meeting] link                                  │     │
│  │  └─ [+ Add Feedback] ──→ Opens Feedback Form             │     │
│  │                                                           │     │
│  │  FEEDBACK (from panelists):                              │     │
│  │  ┌──────────────────────────────────────────┐            │     │
│  │  │  Panelist: Alice Smith                   │            │     │
│  │  │  Recommendation: Strong Hire              │            │     │
│  │  │  Ratings:                                │            │     │
│  │  │    Technical:        ★★★★★ 5/5           │            │     │
│  │  │    Communication:    ★★★★☆ 4/5           │            │     │
│  │  │    Problem Solving:  ★★★★★ 5/5           │            │     │
│  │  │    Cultural Fit:     ★★★★☆ 4/5           │            │     │
│  │  │    Overall:          ★★★★★ 5/5           │            │     │
│  │  │  Comments: "Excellent problem solver..."  │            │     │
│  │  └──────────────────────────────────────────┘            │     │
│  │  ┌──────────────────────────────────────────┐            │     │
│  │  │  Panelist: Bob Johnson                   │            │     │
│  │  │  Recommendation: Hire                     │            │     │
│  │  │  Ratings: 4/5 average                    │            │     │
│  │  │  Comments: "Good technical skills..."     │            │     │
│  │  └──────────────────────────────────────────┘            │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────┐     │
│  │  ROUND 2: HR Interview                                   │     │
│  │  ├─ Status: Scheduled                                    │     │
│  │  ├─ Date/Time: Jan 25, 2025 2:00 PM                     │     │
│  │  └─ Interviewer: Sarah Williams                          │     │
│  └───────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  FEEDBACK FORM (Modal - Opens when panelist clicks "Add Feedback")  │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  Add Feedback for Round 1                                │      │
│  │  ├─ Technical Skills:     [1] [2] [3] [4] [5]           │      │
│  │  ├─ Communication:        [1] [2] [3] [4] [5]           │      │
│  │  ├─ Problem Solving:      [1] [2] [3] [4] [5]           │      │
│  │  ├─ Cultural Fit:         [1] [2] [3] [4] [5]           │      │
│  │  ├─ Overall Rating:       [1] [2] [3] [4] [5]           │      │
│  │  ├─ Recommendation:       [Strong Hire ▼]               │      │
│  │  │   - Strong Hire                                       │      │
│  │  │   - Hire                                              │      │
│  │  │   - Maybe                                             │      │
│  │  │   - No Hire                                           │      │
│  │  │   - Pending                                           │      │
│  │  ├─ Comments: [Text area for detailed feedback]         │      │
│  │  └─ [Cancel] [Submit Feedback]                          │      │
│  └──────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

## User Roles and Permissions

### 1. Recruiter / HR
- View candidate details
- Schedule interviews
- Select panelists from dropdown
- View all feedback

### 2. Panelist
- View assigned interviews
- Add feedback after interview completion
- Rate candidates on multiple criteria
- Make recommendations

### 3. Hiring Manager
- View all candidate details
- Review all feedback from all rounds
- Make final decisions:
  - Select candidate
  - Reject candidate
  - Put on hold
- Schedule interviews

## Key Features

### ⭐ Panelist Dropdown
When scheduling an interview:
- **Multi-select dropdown** showing all panelists
- Shows panelist name and department
- Hold Ctrl/Cmd to select multiple panelists
- Panelist IDs stored as comma-separated values

### 📊 Feedback System
- Ratings on 1-5 scale
- Five categories: Technical, Communication, Problem Solving, Cultural Fit, Overall
- Color-coded ratings (Green: 4-5, Yellow: 3, Red: 1-2)
- Recommendation: Strong Hire, Hire, Maybe, No Hire, Pending
- Detailed comments field

### 🎯 Status Management
**Automatic Status Updates:**
- Based on interview rounds
- Based on hiring manager decisions

**Status Options:**
- Applied
- Screening
- Interview (with round number)
- Offered
- Selected
- Rejected
- OnHold
- Accepted

### 🔄 Interview Round Tracking
- Automatic round numbering
- Shows which round candidate is in
- Multiple feedback entries per round (from different panelists)
- Historical view of all previous rounds

## Data Flow Example

```
1. Recruiter schedules Round 1 Technical Interview
   ├─ Selects 2 panelists: Alice & Bob
   ├─ Sets date/time, meeting link
   └─ Interview created with Round=1

2. Interview takes place
   └─ Status manually updated to "Completed"

3. Panelists add feedback
   ├─ Alice submits: 5/5 overall, "Strong Hire"
   └─ Bob submits: 4/5 overall, "Hire"

4. Recruiter schedules Round 2 HR Interview
   ├─ System auto-sets Round=2
   └─ Selects 1 panelist: Sarah

5. After all rounds, Hiring Manager reviews
   ├─ Sees all feedback from all panelists
   ├─ Reviews ratings and comments
   └─ Makes decision: [Select] / [Reject] / [On Hold]

6. Application status updated
   └─ Candidate receives automated email (if selected)
```

## Navigation Flow

```
Candidate List Page
    ├─ [View Details] → Candidate Details Page
    │                   ├─ View Interview History
    │                   ├─ [Schedule Interview] → Scheduling Form
    │                   ├─ [Add Feedback] → Feedback Form
    │                   └─ [Select/Reject/On Hold] → Update Status
    └─ [← Back to Candidates] → Return to list
```

---

This system provides a complete interview and feedback management solution with all the requested features!
