# WinHire Quick Start Script
# This script helps you start all components of WinHire

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  WinHire Quick Start Guide" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check .NET
try {
    $dotnetVersion = dotnet --version
    Write-Host "✓ .NET SDK $dotnetVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ .NET SDK not found. Please install .NET 8 SDK" -ForegroundColor Red
    Write-Host "  Download from: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Yellow
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Yellow
}

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "✓ Python $pythonVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.9+" -ForegroundColor Red
    Write-Host "  Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Starting WinHire Services" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "To run the complete WinHire system, open 3 separate PowerShell terminals:" -ForegroundColor Yellow
Write-Host ""

Write-Host "Terminal 1 - Backend API:" -ForegroundColor Cyan
Write-Host "  cd WinHire.Backend" -ForegroundColor White
Write-Host "  dotnet run" -ForegroundColor White
Write-Host "  → http://localhost:5000" -ForegroundColor Green
Write-Host ""

Write-Host "Terminal 2 - Frontend UI:" -ForegroundColor Cyan
Write-Host "  cd WinHire.Frontend" -ForegroundColor White
Write-Host "  npm install    # First time only" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "  → http://localhost:5173" -ForegroundColor Green
Write-Host ""

Write-Host "Terminal 3 - Agents:" -ForegroundColor Cyan
Write-Host "  cd WinHire.Agents" -ForegroundColor White
Write-Host "  pip install -r requirements.txt    # First time only" -ForegroundColor Gray
Write-Host "  python agent_intake.py      # OR" -ForegroundColor White
Write-Host "  python agent_workflow.py    # OR" -ForegroundColor White
Write-Host "  python agent_interview.py" -ForegroundColor White
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Quick Actions" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "What would you like to do?" -ForegroundColor Yellow
Write-Host "1. Start Backend only" -ForegroundColor White
Write-Host "2. Start Frontend only" -ForegroundColor White
Write-Host "3. Start All Agents (Unified Manager)" -ForegroundColor White
Write-Host "4. Start Everything (Backend + Agents + Frontend)" -ForegroundColor White
Write-Host "5. Install Frontend dependencies" -ForegroundColor White
Write-Host "6. Install Agent dependencies" -ForegroundColor White
Write-Host "7. Open README" -ForegroundColor White
Write-Host "8. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-8)"

switch ($choice) {
    "1" {
        Write-Host "Starting Backend..." -ForegroundColor Green
        Set-Location -Path "WinHire.Backend"
        dotnet run
    }
    "2" {
        Write-Host "Starting Frontend..." -ForegroundColor Green
        Set-Location -Path "WinHire.Frontend"
        npm run dev
    }
    "3" {
        Write-Host "Starting All Agents..." -ForegroundColor Green
        Set-Location -Path "WinHire.Agents"
        python agent_manager.py
    }
    "4" {
        Write-Host "`n=== Starting Complete WinHire System ===" -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "1. Starting Backend..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-WorkingDirectory", "$PWD\WinHire.Backend", "-Command", "Write-Host 'WinHire Backend' -ForegroundColor Cyan; dotnet run"
        Start-Sleep -Seconds 3
        
        Write-Host "2. Starting Agents..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-WorkingDirectory", "$PWD\WinHire.Agents", "-Command", "Write-Host 'WinHire Agents' -ForegroundColor Cyan; python agent_manager.py"
        Start-Sleep -Seconds 2
        
        Write-Host "3. Starting Frontend..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-WorkingDirectory", "$PWD\WinHire.Frontend", "-Command", "Write-Host 'WinHire Frontend' -ForegroundColor Cyan; npm run dev"
        
        Write-Host ""
        Write-Host "✓ All components started in separate windows!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
        Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
        Write-Host ""
    }
    "5" {
        Write-Host "Installing Frontend dependencies..." -ForegroundColor Green
        Set-Location -Path "WinHire.Frontend"
        npm install
        Write-Host "✓ Dependencies installed!" -ForegroundColor Green
    }
    "6" {
        Write-Host "Installing Agent dependencies..." -ForegroundColor Green
        Set-Location -Path "WinHire.Agents"
        pip install -r requirements.txt
        Write-Host "✓ Dependencies installed!" -ForegroundColor Green
    }
    "7" {
        Write-Host "Opening README..." -ForegroundColor Green
        Start-Process "SYSTEM_STARTUP.md"
    }
    "8" {
        Write-Host "Goodbye! 👋" -ForegroundColor Cyan
        exit
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}
