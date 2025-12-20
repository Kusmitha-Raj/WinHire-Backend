# 🎯 QUICK START GUIDE

## 🚀 3 Simple Steps to Run WinHire

### Step 1: Open 3 PowerShell Terminals

Press `Win + X` and select "Windows PowerShell" (do this 3 times)

---

### Step 2: Navigate to WinHire folder in each terminal

```powershell
cd c:\Users\KusmithaRaj\source\repos\WinHire
```

---

### Step 3: Run these commands in each terminal

#### 🔷 Terminal 1 - Backend API
```powershell
cd WinHire.Backend
dotnet run
```
✅ Wait for: "Now listening on: http://localhost:5000"

#### 🔷 Terminal 2 - Frontend UI
```powershell
cd WinHire.Frontend
npm install
npm run dev
```
✅ Wait for: "Local: http://localhost:5173"

#### 🔷 Terminal 3 - Agent (choose one)
```powershell
cd WinHire.Agents
pip install -r requirements.txt
python agent_intake.py
```
✅ Wait for: "=== Candidate Intake Agent Started ==="

---

## 🌐 Access the Application

**Open your browser and go to:**
```
http://localhost:5173
```

---

## ✅ Test the System

1. Click **"+ Add New Candidate"**
2. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 123-456-7890
   - Role: Software Engineer
3. Click **"Add Candidate"**
4. Wait **60 seconds** - the agent will update the status automatically!
5. Use the dropdown to change status to **"Selected"**
6. Check Terminal 1 (Backend) - you'll see email sent log!

---

## 📚 Need More Help?

Open `README.md` for complete documentation:
```powershell
notepad README.md
```

Or run the helper script:
```powershell
.\START.ps1
```

---

## 🛑 To Stop the System

Press `Ctrl + C` in each terminal

---

## 🎯 URLs Reference

| Service | URL |
|---------|-----|
| Frontend UI | http://localhost:5173 |
| Backend API | http://localhost:5000/api/candidates |
| Swagger Docs | http://localhost:5000 |

---

## 💡 Tips

- **Backend must start first** before frontend
- **Agents need backend running** to work
- **Wait 60 seconds** between status changes (agents run every minute)
- **Email logs** appear in Backend terminal (Terminal 1)
- **Refresh button** manually updates the candidate list

---

## ⚠️ Troubleshooting

### Port Already in Use?
- Close other applications using ports 5000 or 5173
- Or restart your computer

### Module Not Found?
- Run `npm install` in Frontend folder
- Run `pip install -r requirements.txt` in Agents folder

### Cannot Connect to API?
- Make sure Backend (Terminal 1) is running
- Check for errors in Backend terminal

---

**That's it! You're ready to go! 🚀**
