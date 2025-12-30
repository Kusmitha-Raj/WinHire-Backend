# Panelist Specialization Grouping Feature

## Overview
Panelists are now grouped by their specialization (Technical, HR, Managerial, Behavioral) to ensure interviews are conducted by qualified panelists with the right expertise.

## Implementation

### Backend Changes

1. **User Model** (`WinHire.Backend/Models/User.cs`)
   - Added `Specialization` property (string, max 200 chars, nullable)
   - Supports comma-separated values for multi-skilled panelists (e.g., "Technical,Managerial")

2. **Database Migration** (`WinHire.Backend/Migrations/ManualMigration.cs`)
   - Added Specialization column to Users table
   - Migration runs automatically on startup

3. **Database Seeder** (`WinHire.Backend/Services/DatabaseSeeder.cs`)
   - Assigned specializations to all panelists based on department:
     - **Engineering Panelists**: "Technical"
     - **Product Panelists**: "Managerial" or "Managerial,Behavioral"
     - **QA Panelists**: "Technical"
     - **DevOps Panelists**: "Technical"
     - **Data Science Panelists**: "Technical"
     - **Design Panelists**: "Technical,Behavioral" or "Behavioral"

### Frontend Changes

1. **RecruiterDashboard** (`WinHire.Frontend/src/pages/RecruiterDashboard.tsx`)
   - Added `getFilteredPanelists()` function that filters panelists by specialization
   - Interview type selection now automatically filters available panelists
   - Visual indicators:
     - Shows count: "Showing X panelist(s) with [Type] expertise"
     - Warns if no panelists found: "⚠️ No panelists found with [Type] specialization"
   - Panelist dropdown shows specialization in parentheses
   - Changing interview type resets panelist selection

## How It Works

### For Recruiters (Interview Scheduling):

1. Navigate to **Recruiter Dashboard**
2. Click **Schedule Interview** for an application
3. Select **Interview Type** (Technical, HR, Managerial, or Behavioral)
4. The **Panelist dropdown** automatically filters to show only panelists with matching specialization
5. Each panelist shows their specialization in the dropdown (e.g., "David Kim (Technical)")
6. A message shows how many qualified panelists are available
7. Schedule the interview with confidence that the panelist has the right expertise

### Filtering Logic:

```typescript
getFilteredPanelists() {
  if (!newInterview.type) return panelists;
  
  return panelists.filter(p => {
    if (!p.specialization) return true; // Include if no specialization set
    const specializations = p.specialization.toLowerCase().split(',').map(s => s.trim());
    return specializations.includes(newInterview.type.toLowerCase());
  });
}
```

## Panelist Assignments

### Technical Interviews (11 panelists)
- David Kim (Engineering)
- Priya Sharma (Engineering)
- Alex Johnson (Engineering)
- Maria Garcia (Engineering)
- Kevin Zhang (Engineering)
- Daniel Rodriguez (QA)
- Jessica Thompson (QA)
- Rahul Kumar (QA)
- Chris Anderson (DevOps)
- Nina Gupta (DevOps)
- Thomas White (Data Science)
- Amanda Liu (Data Science)
- Oliver Martin (Design - also Behavioral)

### Managerial Interviews (3 panelists)
- Emily Davis (Product - also Behavioral)
- Michael Lee (Product)
- Sophia Patel (Product)

### Behavioral Interviews (3 panelists)
- Emily Davis (Product - also Managerial)
- Oliver Martin (Design - also Technical)
- Emma Wilson (Design)

### HR Interviews
- Currently no specialized HR panelists
- Recruiters/HR staff typically handle HR interviews separately

## Benefits

1. **Right Expertise**: Ensures interviews are conducted by panelists with relevant skills
2. **Better Hiring Decisions**: Qualified panelists can better assess candidates
3. **Efficient Scheduling**: Recruiters quickly see available qualified panelists
4. **Flexibility**: Panelists can have multiple specializations
5. **Clear Communication**: Visual indicators show filtering status

## Testing the Feature

### Test Case 1: Technical Interview
1. Login as recruiter (lisa.anderson@winwire.com / recruiter123)
2. Go to Recruiter Dashboard
3. Click "Schedule Interview" for any application
4. Select "Technical" as interview type
5. **Expected**: See 13 panelists with Technical specialization
6. **Verify**: Panelist names show "(Technical)" or "(Technical,Behavioral)"

### Test Case 2: Managerial Interview
1. Select "Managerial" as interview type
2. **Expected**: See 3 panelists (Emily Davis, Michael Lee, Sophia Patel)
3. **Verify**: Emily Davis shows "(Managerial,Behavioral)"

### Test Case 3: Behavioral Interview
1. Select "Behavioral" as interview type
2. **Expected**: See 3 panelists (Emily Davis, Oliver Martin, Emma Wilson)
3. **Verify**: Multi-skilled panelists show both specializations

### Test Case 4: HR Interview
1. Select "HR" as interview type
2. **Expected**: Warning message "⚠️ No panelists found with HR specialization"
3. **Action**: Add HR specialization to recruiters or create dedicated HR panelists

## Future Enhancements

1. Add Specialization field to Admin Dashboard's "Add User" form
2. Allow editing specialization for existing users
3. Add specialization-based reporting (interviews per specialization)
4. Create dedicated HR interview panelists
5. Add validation to ensure at least one panelist per specialization
6. Consider skill-level ratings (Junior/Senior) within specializations

## Database Schema

```sql
-- Users table now includes:
CREATE TABLE Users (
    ...
    Specialization VARCHAR(200) NULL,
    ...
);
```

## Migration Status

✅ Migration completed successfully
✅ Specialization column added to Users table
✅ All 23 existing users updated with appropriate specializations
✅ Frontend filtering functional
✅ Backend seeding updated
