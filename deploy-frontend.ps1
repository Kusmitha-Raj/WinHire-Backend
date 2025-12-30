# Deploy Frontend to Azure
param(
    [Parameter(Mandatory=$true)]
    [string]$FrontendAppName,
    
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl
)

Write-Host "Building frontend..." -ForegroundColor Cyan
Set-Location "WinHire.Frontend"

# Create production environment file
@"
VITE_API_URL=$BackendUrl
"@ | Out-File -FilePath ".env.production" -Encoding utf8

# Install dependencies and build
npm install
npm run build

# Create deployment package
Compress-Archive -Path ./dist/* -DestinationPath ../frontend-deploy.zip -Force

Set-Location ..

Write-Host "`nDeployment package created: frontend-deploy.zip" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Go to Azure Portal" -ForegroundColor White
Write-Host "2. Navigate to App Service: $FrontendAppName" -ForegroundColor White
Write-Host "3. Go to Deployment Center" -ForegroundColor White
Write-Host "4. Upload frontend-deploy.zip" -ForegroundColor White
Write-Host "`nOr use this command if Azure CLI is configured:" -ForegroundColor Yellow
Write-Host "az webapp deploy --resource-group RG-WinBuild1-Winchestrator --name $FrontendAppName --src-path frontend-deploy.zip --type zip" -ForegroundColor Gray
