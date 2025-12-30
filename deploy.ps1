# WinHire Azure Deployment Script
# This script deploys the WinHire application to Azure

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus",
    
    [Parameter(Mandatory=$true)]
    [string]$SqlAdminUsername,
    
    [Parameter(Mandatory=$true)]
    [SecureString]$SqlAdminPassword
)

Write-Host "Starting WinHire deployment to Azure..." -ForegroundColor Green

# Check if Azure CLI is installed
try {
    az --version | Out-Null
} catch {
    Write-Error "Azure CLI is not installed. Please install it from https://aka.ms/installazurecliwindows"
    exit 1
}

# Check if logged in
$account = az account show 2>$null
if (-not $account) {
    Write-Host "Please login to Azure..." -ForegroundColor Yellow
    az login
}

Write-Host "Current subscription:" -ForegroundColor Cyan
az account show --query "{Name:name, SubscriptionId:id}" -o table

# Create resource group if it doesn't exist
Write-Host "`nCreating/Verifying resource group: $ResourceGroupName" -ForegroundColor Cyan
az group create --name $ResourceGroupName --location $Location

# Convert SecureString to plain text for deployment
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SqlAdminPassword)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Deploy ARM template
Write-Host "`nDeploying Azure resources..." -ForegroundColor Cyan
$deployment = az deployment group create `
    --resource-group $ResourceGroupName `
    --template-file "azure-deploy.json" `
    --parameters sqlAdministratorLogin=$SqlAdminUsername `
    --parameters sqlAdministratorPassword=$PlainPassword `
    --query "properties.outputs" `
    -o json | ConvertFrom-Json

$backendUrl = $deployment.backendUrl.value
$frontendUrl = $deployment.frontendUrl.value
$sqlServerFqdn = $deployment.sqlServerFqdn.value

Write-Host "`nResources deployed successfully!" -ForegroundColor Green
Write-Host "Backend URL: $backendUrl" -ForegroundColor Yellow
Write-Host "Frontend URL: $frontendUrl" -ForegroundColor Yellow
Write-Host "SQL Server: $sqlServerFqdn" -ForegroundColor Yellow

# Get backend app name
$backendAppName = ($backendUrl -replace 'https://', '') -replace '.azurewebsites.net', ''
$frontendAppName = ($frontendUrl -replace 'https://', '') -replace '.azurewebsites.net', ''

# Deploy Backend
Write-Host "`nBuilding and deploying backend..." -ForegroundColor Cyan
Push-Location "WinHire.Backend"
dotnet publish -c Release -o ./publish
Compress-Archive -Path ./publish/* -DestinationPath ../backend-deploy.zip -Force
Pop-Location

az webapp deploy --resource-group $ResourceGroupName `
    --name $backendAppName `
    --src-path "backend-deploy.zip" `
    --type zip

# Deploy Frontend
Write-Host "`nBuilding and deploying frontend..." -ForegroundColor Cyan
Push-Location "WinHire.Frontend"

# Update .env for production
@"
VITE_API_URL=$backendUrl
"@ | Out-File -FilePath ".env.production" -Encoding utf8

npm install
npm run build
Compress-Archive -Path ./dist/* -DestinationPath ../frontend-deploy.zip -Force
Pop-Location

az webapp deploy --resource-group $ResourceGroupName `
    --name $frontendAppName `
    --src-path "frontend-deploy.zip" `
    --type zip

# Clean up
Remove-Item backend-deploy.zip -ErrorAction SilentlyContinue
Remove-Item frontend-deploy.zip -ErrorAction SilentlyContinue

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nYour application is available at:" -ForegroundColor Cyan
Write-Host "Frontend: $frontendUrl" -ForegroundColor Yellow
Write-Host "Backend API: $backendUrl" -ForegroundColor Yellow
Write-Host "`nPlease wait a few minutes for the applications to fully start." -ForegroundColor Gray
