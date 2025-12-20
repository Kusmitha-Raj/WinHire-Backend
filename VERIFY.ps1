# WinHire System Verification Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WinHire System Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Function to check if a file exists
function Test-FileExists {
    param($Path, $Description)
    if (Test-Path $Path) {
        Write-Host "✓ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ $Description - NOT FOUND" -ForegroundColor Red
        return $false
    }
}

# Function to check prerequisites
function Test-Prerequisite {
    param($Command, $Name)
    try {
        $null = & $Command --version 2>&1
        Write-Host "✓ $Name is installed" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ $Name is NOT installed" -ForegroundColor Red
        return $false
    }
}

Write-Host "1. Checking Prerequisites..." -ForegroundColor Yellow
Write-Host ""

$dotnetOk = Test-Prerequisite "dotnet" ".NET SDK"
$nodeOk = Test-Prerequisite "node" "Node.js"
$npmOk = Test-Prerequisite "npm" "npm"
$pythonOk = Test-Prerequisite "python" "Python"

Write-Host ""
Write-Host "2. Checking Backend Files..." -ForegroundColor Yellow
Write-Host ""

$backendOk = $true
$backendOk = $backendOk -and (Test-FileExists "WinHire.Backend\Program.cs" "Program.cs")
$backendOk = $backendOk -and (Test-FileExists "WinHire.Backend\WinHire.Backend.csproj" "Project file")
$backendOk = $backendOk -and (Test-FileExists "WinHire.Backend\Controllers\CandidatesController.cs" "Controller")
$backendOk = $backendOk -and (Test-FileExists "WinHire.Backend\Services\CandidateService.cs" "Service")
$backendOk = $backendOk -and (Test-FileExists "WinHire.Backend\Services\EmailService.cs" "Email Service")
$backendOk = $backendOk -and (Test-FileExists "WinHire.Backend\Repositories\CandidateRepository.cs" "Repository")
$backendOk = $backendOk -and (Test-FileExists "WinHire.Backend\Models\Candidate.cs" "Model")
$backendOk = $backendOk -and (Test-FileExists "WinHire.Backend\Data\AppDbContext.cs" "DbContext")
$backendOk = $backendOk -and (Test-FileExists "WinHire.Backend\appsettings.json" "Configuration")

Write-Host ""
Write-Host "3. Checking Frontend Files..." -ForegroundColor Yellow
Write-Host ""

$frontendOk = $true
$frontendOk = $frontendOk -and (Test-FileExists "WinHire.Frontend\package.json" "package.json")
$frontendOk = $frontendOk -and (Test-FileExists "WinHire.Frontend\src\App.tsx" "App.tsx")
$frontendOk = $frontendOk -and (Test-FileExists "WinHire.Frontend\src\pages\CandidateList.tsx" "CandidateList")
$frontendOk = $frontendOk -and (Test-FileExists "WinHire.Frontend\src\api\candidateApi.ts" "API Integration")
$frontendOk = $frontendOk -and (Test-FileExists "WinHire.Frontend\tailwind.config.js" "Tailwind Config")
$frontendOk = $frontendOk -and (Test-FileExists "WinHire.Frontend\vite.config.ts" "Vite Config")

Write-Host ""
Write-Host "4. Checking Agent Files..." -ForegroundColor Yellow
Write-Host ""

$agentsOk = $true
$agentsOk = $agentsOk -and (Test-FileExists "WinHire.Agents\agent_intake.py" "Intake Agent")
$agentsOk = $agentsOk -and (Test-FileExists "WinHire.Agents\agent_workflow.py" "Workflow Agent")
$agentsOk = $agentsOk -and (Test-FileExists "WinHire.Agents\agent_interview.py" "Interview Agent")
$agentsOk = $agentsOk -and (Test-FileExists "WinHire.Agents\requirements.txt" "Requirements")

Write-Host ""
Write-Host "5. Checking Documentation..." -ForegroundColor Yellow
Write-Host ""

$docsOk = $true
$docsOk = $docsOk -and (Test-FileExists "README.md" "Main README")
$docsOk = $docsOk -and (Test-FileExists "QUICKSTART.md" "Quick Start Guide")
$docsOk = $docsOk -and (Test-FileExists "SUMMARY.md" "System Summary")
$docsOk = $docsOk -and (Test-FileExists "WinHire.Backend\README.md" "Backend README")
$docsOk = $docsOk -and (Test-FileExists "WinHire.Frontend\README.md" "Frontend README")
$docsOk = $docsOk -and (Test-FileExists "WinHire.Agents\README.md" "Agents README")

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Verification Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($dotnetOk -and $nodeOk -and $npmOk -and $pythonOk) {
    Write-Host "✓ Prerequisites: ALL OK" -ForegroundColor Green
} else {
    Write-Host "✗ Prerequisites: MISSING" -ForegroundColor Red
    $allGood = $false
}

if ($backendOk) {
    Write-Host "✓ Backend: ALL OK" -ForegroundColor Green
} else {
    Write-Host "✗ Backend: MISSING FILES" -ForegroundColor Red
    $allGood = $false
}

if ($frontendOk) {
    Write-Host "✓ Frontend: ALL OK" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend: MISSING FILES" -ForegroundColor Red
    $allGood = $false
}

if ($agentsOk) {
    Write-Host "✓ Agents: ALL OK" -ForegroundColor Green
} else {
    Write-Host "✗ Agents: MISSING FILES" -ForegroundColor Red
    $allGood = $false
}

if ($docsOk) {
    Write-Host "✓ Documentation: ALL OK" -ForegroundColor Green
} else {
    Write-Host "✗ Documentation: MISSING FILES" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host ""
    Write-Host "🎉 SUCCESS! WinHire is ready to run!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Open 3 PowerShell terminals" -ForegroundColor White
    Write-Host "2. Terminal 1: cd WinHire.Backend; dotnet run" -ForegroundColor White
    Write-Host "3. Terminal 2: cd WinHire.Frontend; npm install; npm run dev" -ForegroundColor White
    Write-Host "4. Terminal 3: cd WinHire.Agents; pip install -r requirements.txt; python agent_intake.py" -ForegroundColor White
    Write-Host ""
    Write-Host "Then open: http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠️  ISSUES DETECTED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please resolve the issues above before running." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "For detailed instructions, see:" -ForegroundColor Yellow
Write-Host "  - QUICKSTART.md (simple guide)" -ForegroundColor White
Write-Host "  - README.md (complete documentation)" -ForegroundColor White
Write-Host "  - SUMMARY.md (system overview)" -ForegroundColor White
Write-Host ""
