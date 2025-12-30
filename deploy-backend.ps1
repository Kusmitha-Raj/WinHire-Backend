# Deploy Backend to Azure
param(
    [Parameter(Mandatory=$true)]
    [string]$BackendAppName
)

Write-Host "Building backend..." -ForegroundColor Cyan
Set-Location "WinHire.Backend"

# Build and publish
Remove-Item -Path "publish" -Recurse -Force -ErrorAction SilentlyContinue
dotnet publish -c Release -o ./publish

# Create deployment package from INSIDE publish directory to avoid path issues
Set-Location "publish"
Compress-Archive -Path * -DestinationPath ../../backend-deploy.zip -Force
Set-Location ../..

Write-Host "`nDeployment package created: backend-deploy.zip" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Go to Azure Portal" -ForegroundColor White
Write-Host "2. Navigate to App Service: $BackendAppName" -ForegroundColor White
Write-Host "3. Go to Deployment Center > FTPS credentials" -ForegroundColor White
Write-Host "4. Click 'Zip Deploy' or upload backend-deploy.zip manually" -ForegroundColor White
Write-Host "`nOr use this command if Azure CLI is configured:" -ForegroundColor Yellow
Write-Host "az webapp deploy --resource-group RG-WinBuild1-Winchestrator --name $BackendAppName --src-path backend-deploy.zip --type zip" -ForegroundColor Gray
