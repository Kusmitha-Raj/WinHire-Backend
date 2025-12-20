@echo off
echo ================================
echo   WinHire System Overview
echo ================================
echo.
echo Complete Production-Ready System:
echo.
echo [1] Backend API (ASP.NET Core 8)
echo     - RESTful API with Swagger
echo     - SQLite database
echo     - Email notifications
echo     - URL: http://localhost:5000
echo.
echo [2] Frontend UI (React + Tailwind)
echo     - Modern responsive interface
echo     - Real-time updates
echo     - Statistics dashboard
echo     - URL: http://localhost:5173
echo.
echo [3] Automation Agents (Python)
echo     - Intake Agent
echo     - Workflow Agent
echo     - Interview Agent
echo.
echo ================================
echo   How to Start
echo ================================
echo.
echo Open 3 PowerShell terminals:
echo.
echo Terminal 1:
echo   cd WinHire.Backend
echo   dotnet run
echo.
echo Terminal 2:
echo   cd WinHire.Frontend
echo   npm install
echo   npm run dev
echo.
echo Terminal 3:
echo   cd WinHire.Agents
echo   pip install -r requirements.txt
echo   python agent_intake.py
echo.
echo ================================
echo.
echo For detailed instructions, see README.md
echo.
pause
