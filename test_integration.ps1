# Integration Test Script
# Tests Backend + Agent Integration

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Backend + Agents Integration Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if backend is running
Write-Host "1. Testing Backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/candidates" -Method GET
    Write-Host "   ✓ Backend API is running" -ForegroundColor Green
    Write-Host "   Found $($response.Count) candidates" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Backend API is not running!" -ForegroundColor Red
    Write-Host "   Please start the backend first: cd WinHire.Backend; dotnet run" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 2: Add a test candidate without status
Write-Host "2. Adding test candidate (no status)..." -ForegroundColor Yellow
$testCandidate = @{
    name = "John Test"
    email = "john.test@example.com"
    phone = "123-456-7890"
    position = "Senior Developer"
    experience = 5
    skills = "C#, .NET, Python"
    status = ""
} | ConvertTo-Json

try {
    $newCandidate = Invoke-RestMethod -Uri "http://localhost:5000/api/candidates" -Method POST -Body $testCandidate -ContentType "application/json"
    Write-Host "   ✓ Test candidate created with ID: $($newCandidate.id)" -ForegroundColor Green
    $testCandidateId = $newCandidate.id
} catch {
    Write-Host "   ✗ Failed to create test candidate" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 3: Run Intake Agent once
Write-Host "3. Testing Candidate Intake Agent..." -ForegroundColor Yellow
Write-Host "   The agent will assign 'Application Received' status to candidates without status" -ForegroundColor Gray
Write-Host ""

# Give user option to run agent
Write-Host "Would you like to:" -ForegroundColor Yellow
Write-Host "1. Run Intake Agent (processes candidates without status)" -ForegroundColor White
Write-Host "2. Run Workflow Agent (moves Application Received -> Under Review -> Shortlisted)" -ForegroundColor White
Write-Host "3. Run Interview Agent (Shortlisted -> Interview Scheduled)" -ForegroundColor White
Write-Host "4. View all candidates" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "Starting Intake Agent..." -ForegroundColor Green
        Push-Location WinHire.Agents
        python agent_intake.py
        Pop-Location
    }
    "2" {
        Write-Host "Starting Workflow Agent..." -ForegroundColor Green
        Push-Location WinHire.Agents
        python agent_workflow.py
        Pop-Location
    }
    "3" {
        Write-Host "Starting Interview Agent..." -ForegroundColor Green
        Push-Location WinHire.Agents
        python agent_interview.py
        Pop-Location
    }
    "4" {
        Write-Host "Fetching all candidates..." -ForegroundColor Green
        $candidates = Invoke-RestMethod -Uri "http://localhost:5000/api/candidates" -Method GET
        $candidates | Format-Table -Property id, name, email, position, status -AutoSize
    }
    "5" {
        Write-Host "Exiting..." -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
    }
}
