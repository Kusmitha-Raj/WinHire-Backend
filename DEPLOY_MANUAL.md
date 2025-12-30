# Manual Deployment Guide for WinHire

## Option 1: Using Azure Portal (Easiest)

### Step 1: Upload Backend
1. Go to **Azure Portal** → **winhire-backend-2unechvj4j5nw**
2. In the left menu, click **"Advanced Tools"** (or search for "Kudu")
3. Click **"Go →"** to open Kudu console
4. In the top menu, click **"Tools"** → **"Zip Push Deploy"**
5. Drag and drop **backend-deploy.zip** to the `/site/wwwroot` folder
6. Wait for extraction to complete

### Step 2: Upload Frontend
1. Go to **Azure Portal** → **winhire-frontend-2unechvj4j5nw**
2. Click **"Advanced Tools"** → **"Go →"**
3. Click **"Tools"** → **"Zip Push Deploy"**
4. Drag and drop **frontend-deploy.zip** to the `/site/wwwroot` folder
5. Wait for extraction to complete

---

## Option 2: Using Command Line (If Azure CLI is installed)

First, install Azure CLI from: https://aka.ms/installazurecliwindows

Then run:

```powershell
# Login to Azure
az login

# Deploy Backend
az webapp deployment source config-zip `
  --resource-group RG-WinBuild1-Winchestrator `
  --name winhire-backend-2unechvj4j5nw `
  --src backend-deploy.zip

# Deploy Frontend
az webapp deployment source config-zip `
  --resource-group RG-WinBuild1-Winchestrator `
  --name winhire-frontend-2unechvj4j5nw `
  --src frontend-deploy.zip
```

---

## Option 3: Using Visual Studio Code

1. Install **"Azure App Service"** extension in VS Code
2. Sign in to Azure
3. Right-click on the backend app → **"Deploy to Web App"**
4. Select `WinHire.Backend/bin/Debug/net8.0/publish` folder
5. Repeat for frontend app with `WinHire.Frontend/dist` folder

---

## After Deployment

### Configure Backend Connection String
1. Go to **winhire-backend-2unechvj4j5nw** → **Configuration**
2. Click **"+ New connection string"**
3. Name: `DefaultConnection`
4. Value: Your Azure SQL connection string
5. Type: `SQLAzure`
6. Click **"Save"**

### Test Your Deployment
- **Backend**: https://winhire-backend-2unechvj4j5nw.azurewebsites.net
- **Frontend**: https://winhire-frontend-2unechvj4j5nw.azurewebsites.net
- **Login**: admin@winhire.com / admin123

---

## Troubleshooting

### Backend Not Starting?
1. Go to **winhire-backend-2unechvj4j5nw** → **Log stream**
2. Check for errors
3. Verify connection string is set correctly

### Frontend Not Loading?
1. Check if `VITE_API_URL` environment variable is set to backend URL
2. Go to **Configuration** → **Application settings**
3. Add: `VITE_API_URL = https://winhire-backend-2unechvj4j5nw.azurewebsites.net`
