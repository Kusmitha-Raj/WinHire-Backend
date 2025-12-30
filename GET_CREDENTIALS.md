# How to Get Azure App Service Deployment Credentials

## Method 1: Download Publish Profile (Easiest)

1. Go to **Azure Portal** (https://portal.azure.com)
2. Navigate to your App Service (e.g., **winhire-backend-2unechvj4j5nw**)
3. Click **"Download publish profile"** in the top menu
4. Open the downloaded `.PublishSettings` file in Notepad
5. Find the line with `userPWD="..."` - this is your password
6. Find the line with `userName="..."` - this is your username (starts with `$`)

Example from publish profile:
```xml
<publishProfile 
    userName="$winhire-backend-2unechvj4j5nw" 
    userPWD="AbCdEfGhIjKlMnOpQrStUvWxYz1234567890">
```

## Method 2: Use Deployment Center Credentials

1. Go to **Azure Portal** → Your App Service
2. Click **"Deployment Center"** in the left menu
3. Click **"FTPS credentials"** tab at the top
4. Under **Application scope**:
   - **Username**: `$winhire-backend-2unechvj4j5nw` (or your app name)
   - **Password**: Click "Copy" or reset if needed

## Method 3: Use User-level Credentials

1. Go to **Azure Portal** → Your App Service
2. Click **"Deployment Center"** → **"FTPS credentials"** tab
3. Under **User scope**:
   - Set your own username/password (these work for all your apps)

## Running the Deployment Script

Once you have the credentials:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-to-azure.ps1
```

The script will prompt you for:
1. Backend deployment username (from publish profile)
2. Backend deployment password (from publish profile)
3. Frontend deployment username (from publish profile)
4. Frontend deployment password (from publish profile)

**Note**: Each App Service has its own separate credentials!
