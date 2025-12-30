# Database Migration Guide

## Overview
This guide explains how to apply the database changes needed for the Interview and Feedback Management System.

## New Fields Added

### Interviews Table
```sql
ALTER TABLE Interviews 
ADD Round INT NOT NULL DEFAULT 1,
    PanelistIds NVARCHAR(500) NULL;
```

### Applications Table
```sql
ALTER TABLE Applications 
ADD CurrentRound INT NULL;
```

### Feedback Table
```sql
ALTER TABLE Feedbacks 
ADD Round INT NULL;
```

## Using Entity Framework Migrations

### Step 1: Create Migration
Navigate to the backend project directory and run:

```powershell
cd WinHire.Backend
dotnet ef migrations add AddInterviewRoundsAndPanelists
```

This will generate a migration file with the necessary schema changes.

### Step 2: Review Migration
The generated migration should look like this:

```csharp
public partial class AddInterviewRoundsAndPanelists : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<int>(
            name: "Round",
            table: "Interviews",
            type: "int",
            nullable: false,
            defaultValue: 1);

        migrationBuilder.AddColumn<string>(
            name: "PanelistIds",
            table: "Interviews",
            type: "nvarchar(500)",
            maxLength: 500,
            nullable: true);

        migrationBuilder.AddColumn<int>(
            name: "CurrentRound",
            table: "Applications",
            type: "int",
            nullable: true);

        migrationBuilder.AddColumn<int>(
            name: "Round",
            table: "Feedbacks",
            type: "int",
            nullable: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "Round", table: "Interviews");
        migrationBuilder.DropColumn(name: "PanelistIds", table: "Interviews");
        migrationBuilder.DropColumn(name: "CurrentRound", table: "Applications");
        migrationBuilder.DropColumn(name: "Round", table: "Feedbacks");
    }
}
```

### Step 3: Apply Migration
```powershell
dotnet ef database update
```

### Step 4: Verify Changes
Check your database to ensure the new columns exist:

```sql
-- Check Interviews table
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Interviews'
AND COLUMN_NAME IN ('Round', 'PanelistIds');

-- Check Applications table
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Applications'
AND COLUMN_NAME = 'CurrentRound';

-- Check Feedbacks table
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Feedbacks'
AND COLUMN_NAME = 'Round';
```

## Manual SQL Script (Alternative)

If you prefer to apply changes manually without EF migrations:

```sql
-- Add Round to Interviews
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Interviews') AND name = 'Round')
BEGIN
    ALTER TABLE Interviews ADD Round INT NOT NULL DEFAULT 1;
END

-- Add PanelistIds to Interviews
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Interviews') AND name = 'PanelistIds')
BEGIN
    ALTER TABLE Interviews ADD PanelistIds NVARCHAR(500) NULL;
END

-- Add CurrentRound to Applications
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Applications') AND name = 'CurrentRound')
BEGIN
    ALTER TABLE Applications ADD CurrentRound INT NULL;
END

-- Add Round to Feedbacks
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Feedbacks') AND name = 'Round')
BEGIN
    ALTER TABLE Feedbacks ADD Round INT NULL;
END

PRINT 'Migration completed successfully!';
```

## Data Migration (Optional)

If you have existing data, you may want to update it:

```sql
-- Update existing interviews to have Round = 1
UPDATE Interviews 
SET Round = 1 
WHERE Round IS NULL OR Round = 0;

-- Update CurrentRound for applications with interviews
UPDATE a
SET a.CurrentRound = (
    SELECT MAX(i.Round)
    FROM Interviews i
    WHERE i.ApplicationId = a.Id
)
FROM Applications a
WHERE EXISTS (
    SELECT 1 FROM Interviews i WHERE i.ApplicationId = a.Id
);

-- Update Round for existing feedback based on interview round
UPDATE f
SET f.Round = i.Round
FROM Feedbacks f
INNER JOIN Interviews i ON f.InterviewId = i.Id
WHERE f.InterviewId IS NOT NULL AND f.Round IS NULL;
```

## Verification Queries

### Check Interview Rounds
```sql
SELECT 
    i.Id,
    i.Title,
    i.Round,
    i.PanelistIds,
    i.Status,
    a.Id AS ApplicationId,
    c.Name AS CandidateName
FROM Interviews i
INNER JOIN Applications a ON i.ApplicationId = a.Id
INNER JOIN Candidates c ON a.CandidateId = c.Id
ORDER BY a.Id, i.Round;
```

### Check Application Current Rounds
```sql
SELECT 
    a.Id,
    c.Name AS CandidateName,
    j.Title AS JobTitle,
    a.CurrentRound,
    a.Status,
    COUNT(i.Id) AS TotalInterviews
FROM Applications a
INNER JOIN Candidates c ON a.CandidateId = c.Id
INNER JOIN Jobs j ON a.JobId = j.Id
LEFT JOIN Interviews i ON a.Id = i.ApplicationId
GROUP BY a.Id, c.Name, j.Title, a.CurrentRound, a.Status
ORDER BY a.Id;
```

### Check Feedback with Rounds
```sql
SELECT 
    f.Id,
    f.Round,
    f.OverallRating,
    f.Recommendation,
    i.Title AS InterviewTitle,
    i.Round AS InterviewRound,
    u.Name AS PanelistName,
    c.Name AS CandidateName
FROM Feedbacks f
LEFT JOIN Interviews i ON f.InterviewId = i.Id
INNER JOIN Users u ON f.ProvidedByUserId = u.Id
LEFT JOIN Applications a ON f.ApplicationId = a.Id
LEFT JOIN Candidates c ON a.CandidateId = c.Id
ORDER BY c.Name, f.Round;
```

## Rollback Instructions

If you need to rollback the changes:

### Using EF Migrations
```powershell
# Get the name of the previous migration
dotnet ef migrations list

# Rollback to previous migration
dotnet ef database update <PreviousMigrationName>

# Remove the migration file
dotnet ef migrations remove
```

### Manual Rollback
```sql
ALTER TABLE Interviews DROP COLUMN Round;
ALTER TABLE Interviews DROP COLUMN PanelistIds;
ALTER TABLE Applications DROP COLUMN CurrentRound;
ALTER TABLE Feedbacks DROP COLUMN Round;
```

## Testing After Migration

1. **Start the backend**:
   ```powershell
   dotnet run
   ```

2. **Test new endpoints**:
   ```powershell
   # Get panelists
   curl http://localhost:5000/api/users/panelists

   # Get candidate details
   curl http://localhost:5000/api/candidates/1/details
   ```

3. **Check frontend**:
   - Navigate to candidate list
   - Click "View Details" on a candidate
   - Verify the page loads without errors

## Common Issues

### Issue 1: Migration already exists
**Solution**: Remove the existing migration file and recreate it
```powershell
dotnet ef migrations remove
dotnet ef migrations add AddInterviewRoundsAndPanelists
```

### Issue 2: Database connection error
**Solution**: Check your connection string in appsettings.json

### Issue 3: Column already exists
**Solution**: Skip migration or create a new one with different changes

## Post-Migration Checklist

- [ ] Migration created successfully
- [ ] Migration applied to database
- [ ] New columns exist in database
- [ ] Backend compiles without errors
- [ ] API endpoints return data correctly
- [ ] Frontend displays candidate details
- [ ] Interview scheduling works
- [ ] Feedback submission works
- [ ] Panelist dropdown populates
- [ ] Round numbers display correctly

---

**Important**: Always backup your database before running migrations!

```powershell
# Backup command (SQL Server)
sqlcmd -S localhost -Q "BACKUP DATABASE [WinHire] TO DISK='C:\Backups\WinHire_backup.bak'"
```
