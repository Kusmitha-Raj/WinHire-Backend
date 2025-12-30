# WinHire Azure Deployment Guide

## Prerequisites

1. **Azure CLI**: Install from https://aka.ms/installazurecliwindows
2. **Azure Subscription**: You need an active Azure subscription
3. **Resource Group**: Know the name of the resource group where you want to deploy

## Deployment Steps

### Option 1: Using PowerShell Script (Recommended)

1. Open PowerShell in the project root directory
2. Run the deployment script:

```powershell
# Set your parameters
$resourceGroup = "YOUR_RESOURCE_GROUP_NAME"
$sqlUsername = "sqladmin"
$sqlPassword = ConvertTo-SecureString "YourStrongPassword123!" -AsPlainText -Force

# Run deployment
.\deploy.ps1 -ResourceGroupName $resourceGroup -SqlAdminUsername $sqlUsername -SqlAdminPassword $sqlPassword -Location "eastus"
```

### Option 2: Manual Deployment via Azure Portal

1. Login to Azure Portal (https://portal.azure.com)
2. Navigate to your resource group
3. Click "Deploy a custom template"
4. Click "Build your own template in the editor"
5. Copy and paste the contents of `azure-deploy.json`
6. Fill in the required parameters:
   - **appName**: Base name for your resources (e.g., "winhire")
   - **sqlAdministratorLogin**: SQL Server admin username
   - **sqlAdministratorPassword**: Strong password for SQL Server

### Option 3: Using Azure CLI Commands

```powershell
# Login to Azure
az login

# Set variables
$resourceGroup = "YOUR_RESOURCE_GROUP_NAME"
$location = "eastus"

# Create resource group (if it doesn't exist)
az group create --name $resourceGroup --location $location

# Deploy ARM template
az deployment group create `
    --resource-group $resourceGroup `
    --template-file azure-deploy.json `
    --parameters sqlAdministratorLogin=sqladmin `
    --parameters sqlAdministratorPassword="YourStrongPassword123!"
```

## What Gets Deployed

The deployment creates the following Azure resources:

1. **Azure SQL Server** - Hosts the database
2. **Azure SQL Database** - WinHireDb database (Basic tier)
3. **App Service Plan** - Linux-based B1 tier
4. **Backend App Service** - .NET 8.0 Web API
5. **Frontend App Service** - Node.js 20 LTS for React/Vite app

## Post-Deployment Configuration

### 1. Update CORS Settings

After deployment, update the backend's CORS settings if needed:

```powershell
az webapp cors add --resource-group $resourceGroup --name <backend-app-name> --allowed-origins "*"
```

### 2. Database Migration

The application will automatically run EF migrations on first startup.

### 3. Verify Deployment

- Backend API (Swagger): `https://<backend-app-name>.azurewebsites.net`
- Frontend App: `https://<frontend-app-name>.azurewebsites.net`

## Default Login Credentials

After deployment, you can login with these test accounts:

- **Admin**: admin@winhire.com / admin123
- **Recruiter**: recruiter@winhire.com / recruiter123
- **Manager**: manager@winhire.com / manager123
- **Panelist**: panelist@winhire.com / panelist123

## Troubleshooting

### Application not starting
1. Check application logs in Azure Portal
2. Go to App Service → Monitoring → Log Stream

### Database connection issues
1. Verify SQL Server firewall rules allow Azure services
2. Check connection string in App Service configuration

### CORS errors
1. Ensure backend CORS settings include frontend URL
2. Update in Azure Portal: App Service → CORS

## Cost Estimation

Based on the deployed resources (Basic tier):
- SQL Database (Basic): ~$5/month
- App Service Plan (B1): ~$13/month
- **Total**: ~$18/month

## Scaling

To scale the application:

```powershell
# Scale App Service Plan
az appservice plan update --name <plan-name> --resource-group $resourceGroup --sku P1V2

# Scale SQL Database
az sql db update --resource-group $resourceGroup --server <server-name> --name WinHireDb --service-objective S1
```

## Clean Up Resources

To delete all resources and stop charges:

```powershell
az group delete --name $resourceGroup --yes --no-wait
```
