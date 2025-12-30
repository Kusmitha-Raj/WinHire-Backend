# Simple Azure Deployment Steps

## Method 1: Using SSH/Console in Azure Portal

### For Backend (winhire-backend-2unechvj4j5nw):

1. Go to Azure Portal → **winhire-backend-2unechvj4j5nw**
2. In left menu, scroll down and click **"SSH"** or **"Console"**
3. In the console window, run these commands:

```bash
cd /home/site/wwwroot
rm -rf *
```

4. Now we need to upload the file. Since there's no direct upload in console, use this method:
   - Open **"Advanced Tools"** (Kudu) from left menu
   - Click **"Go →"** - this opens a new window
   - In the Kudu window, click **"Debug console"** → **"CMD"** at the top
   - Navigate to `/site/wwwroot`
   - You'll see a file explorer area above the console
   - **Drag and drop `backend-deploy.zip`** directly into that file explorer area
   - Once uploaded, run in the console:

```bash
cd /home/site/wwwroot
unzip backend-deploy.zip
rm backend-deploy.zip
```

### For Frontend (winhire-frontend-2unechvj4j5nw):

Repeat the same steps but with `frontend-deploy.zip`

---

## Method 2: Using FTP (If you have FTP client like FileZilla)

### Get FTP Credentials:

1. Go to your App Service → **Deployment Center**
2. Click **"FTPS credentials"** tab
3. Copy the:
   - **FTPS endpoint**
   - **Username** 
   - **Password**

### Upload Files:

1. Open FileZilla (or any FTP client)
2. Connect using the FTPS credentials
3. Navigate to `/site/wwwroot`
4. Upload your zip file
5. Extract it

---

## Method 3: Install Azure CLI (Recommended for Future)

Download and install: https://aka.ms/installazurecliwindows

After installation, close and reopen PowerShell, then run:

```powershell
az login
az webapp deployment source config-zip --resource-group RG-WinBuild1-Winchestrator --name winhire-backend-2unechvj4j5nw --src backend-deploy.zip
az webapp deployment source config-zip --resource-group RG-WinBuild1-Winchestrator --name winhire-frontend-2unechvj4j5nw --src frontend-deploy.zip
```

---

## Quick Test Method

Try this simple PowerShell command using curl:

### For Backend:
```powershell
# Get publish profile first from Azure Portal: App Service → Download publish profile
# Open the .PublishSettings file and copy the userName and userPWD

$user = "$winhire-backend-2unechvj4j5nw"  # Replace with actual username from publish profile
$pass = "YourPasswordHere"  # Replace with actual password from publish profile
$pair = "$($user):$($pass)"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))

Invoke-RestMethod -Uri "https://winhire-backend-2unechvj4j5nw.scm.azurewebsites.net/api/zipdeploy" -Method POST -InFile "backend-deploy.zip" -Headers @{Authorization=("Basic {0}" -f $encodedCreds)} -ContentType "application/zip"
```

This will upload directly via the Kudu API.
