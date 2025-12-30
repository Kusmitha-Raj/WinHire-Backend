# Deploy to Azure App Services using Kudu API
param(
    [string]$BackendAppName = "winhire-backend-2unechvj4j5nw",
    [string]$FrontendAppName = "winhire-frontend-2unechvj4j5nw"
)

Write-Host "=== WinHire Azure Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Function to deploy zip to Azure App Service
function Deploy-ZipToAzure {
    param(
        [string]$AppName,
        [string]$ZipPath,
        [string]$Username,
        [string]$Password
    )
    
    Write-Host "Deploying $ZipPath to $AppName..." -ForegroundColor Yellow
    
    $kuduUrl = "https://$AppName.scm.azurewebsites.net/api/zipdeploy"
    $base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($Username):$($Password)"))
    
    try {
        Invoke-RestMethod -Uri $kuduUrl -Method POST -InFile $ZipPath -Headers @{
            Authorization = "Basic $base64AuthInfo"
        } -ContentType "application/zip" -TimeoutSec 600 | Out-Null
        
        Write-Host "✓ Deployment successful!" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Check if zip files exist
$backendZip = "backend-deploy.zip"
$frontendZip = "frontend-deploy.zip"

if (-not (Test-Path $backendZip)) {
    Write-Host "✗ Backend deployment package not found: $backendZip" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendZip)) {
    Write-Host "✗ Frontend deployment package not found: $frontendZip" -ForegroundColor Red
    exit 1
}

Write-Host "Deployment packages found:" -ForegroundColor Green
Write-Host "  Backend:  $backendZip"
Write-Host "  Frontend: $frontendZip"
Write-Host ""

# Get deployment credentials
Write-Host "=== Deployment Credentials ===" -ForegroundColor Cyan
Write-Host "You need deployment credentials from Azure Portal:" -ForegroundColor Yellow
Write-Host "1. Go to App Service -> Download publish profile" -ForegroundColor Yellow
Write-Host "2. Open .PublishSettings file in Notepad" -ForegroundColor Yellow
Write-Host "3. Find userName and userPWD values" -ForegroundColor Yellow
Write-Host ""

# Prompt for backend credentials
Write-Host "=== Backend Deployment ($BackendAppName) ===" -ForegroundColor Cyan
$backendUser = Read-Host "Enter backend deployment username"
$backendPass = Read-Host "Enter backend deployment password" -AsSecureString
$backendPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($backendPass))

Write-Host ""
Write-Host "Deploying backend..." -ForegroundColor Yellow
$backendSuccess = Deploy-ZipToAzure -AppName $BackendAppName -ZipPath $backendZip -Username $backendUser -Password $backendPassPlain

Write-Host ""

# Prompt for frontend credentials
Write-Host "=== Frontend Deployment ($FrontendAppName) ===" -ForegroundColor Cyan
$frontendUser = Read-Host "Enter frontend deployment username"
$frontendPass = Read-Host "Enter frontend deployment password" -AsSecureString
$frontendPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($frontendPass))

Write-Host ""
Write-Host "Deploying frontend..." -ForegroundColor Yellow
$frontendSuccess = Deploy-ZipToAzure -AppName $FrontendAppName -ZipPath $frontendZip -Username $frontendUser -Password $frontendPassPlain

Write-Host ""
Write-Host "=== Deployment Summary ===" -ForegroundColor Cyan
Write-Host "Backend:  $(if($backendSuccess){'✓ Success'}else{'✗ Failed'})" -ForegroundColor $(if($backendSuccess){'Green'}else{'Red'})
Write-Host "Frontend: $(if($frontendSuccess){'✓ Success'}else{'✗ Failed'})" -ForegroundColor $(if($frontendSuccess){'Green'}else{'Red'})

if ($backendSuccess -and $frontendSuccess) {
    Write-Host ""
    Write-Host "=== Deployment Complete! ===" -ForegroundColor Green
    Write-Host "Backend URL:  https://$BackendAppName.azurewebsites.net" -ForegroundColor Cyan
    Write-Host "Frontend URL: https://$FrontendAppName.azurewebsites.net" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Test login: admin@winhire.com / admin123" -ForegroundColor Yellow
}
