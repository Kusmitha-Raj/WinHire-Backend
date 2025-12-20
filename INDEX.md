# 📚 WinHire Documentation Index

Welcome to **WinHire** - Complete Candidate Management System!

This index will help you find the right documentation for your needs.

---

## 🚀 Getting Started (Choose One)

### For Quick Setup (5 minutes)
👉 **[QUICKSTART.md](QUICKSTART.md)** - Simple 3-step guide to get running fast

### For Complete Understanding (15 minutes)
👉 **[README.md](README.md)** - Comprehensive guide with all details

### For System Overview
👉 **[SUMMARY.md](SUMMARY.md)** - Visual overview and architecture

---

## 📖 Core Documentation

### Main Guides
- **[README.md](README.md)** - Complete setup & usage guide (Main documentation)
- **[QUICKSTART.md](QUICKSTART.md)** - Fast 3-step setup
- **[SUMMARY.md](SUMMARY.md)** - System architecture & overview

### Component Documentation
- **[WinHire.Backend/README.md](WinHire.Backend/README.md)** - Backend API guide
- **[WinHire.Frontend/README.md](WinHire.Frontend/README.md)** - Frontend UI guide
- **[WinHire.Agents/README.md](WinHire.Agents/README.md)** - Agent automation guide

### Reference Documentation
- **[FEATURES.md](FEATURES.md)** - Complete feature list (200+ features)
- **[TESTING.md](TESTING.md)** - End-to-end testing guide

---

## 🛠️ Helper Scripts

### Windows PowerShell Scripts
- **[START.ps1](START.ps1)** - Interactive startup menu
- **[VERIFY.ps1](VERIFY.ps1)** - System verification checker
- **[INFO.bat](INFO.bat)** - Quick info display (CMD)

### Usage:
```powershell
# Interactive start menu
.\START.ps1

# Verify system is ready
.\VERIFY.ps1

# Quick info (Windows CMD)
INFO.bat
```

---

## 📋 Documentation by Task

### "I want to install and run WinHire"
1. Read **[QUICKSTART.md](QUICKSTART.md)** for fast setup
2. OR read **[README.md](README.md)** for detailed setup
3. Run **[VERIFY.ps1](VERIFY.ps1)** to check prerequisites
4. Use **[START.ps1](START.ps1)** for guided startup

### "I want to understand the architecture"
1. Read **[SUMMARY.md](SUMMARY.md)** for system overview
2. Read **[README.md](README.md)** "System Architecture" section
3. Check **[FEATURES.md](FEATURES.md)** for component details

### "I want to test the system"
1. Follow **[TESTING.md](TESTING.md)** for complete test suite
2. Check **[README.md](README.md)** "Troubleshooting" section

### "I want to configure email"
1. Read **[WinHire.Backend/README.md](WinHire.Backend/README.md)** "Email Configuration"
2. Edit `WinHire.Backend/appsettings.json`
3. See **[README.md](README.md)** "Email Feature" section

### "I want to customize agents"
1. Read **[WinHire.Agents/README.md](WinHire.Agents/README.md)**
2. Edit Python files in `WinHire.Agents/`
3. See **[FEATURES.md](FEATURES.md)** "Agent Features" section

### "I want to modify the UI"
1. Read **[WinHire.Frontend/README.md](WinHire.Frontend/README.md)**
2. Edit files in `WinHire.Frontend/src/`
3. See **[FEATURES.md](FEATURES.md)** "Frontend Features" section

### "I'm having issues"
1. Check **[README.md](README.md)** "Troubleshooting" section
2. Run **[VERIFY.ps1](VERIFY.ps1)** to diagnose
3. Review **[TESTING.md](TESTING.md)** "Common Issues" section

---

## 🎯 Quick Reference

### URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/candidates
- **Swagger Docs:** http://localhost:5000

### Default Ports
- Backend: 5000
- Frontend: 5173
- Agents: N/A (client only)

### Technology Stack
- Backend: .NET 8, Entity Framework Core, SQLite
- Frontend: React 19, TypeScript, Tailwind CSS
- Agents: Python 3.9+, Requests library

### Key Files
- Backend Entry: `WinHire.Backend/Program.cs`
- Frontend Entry: `WinHire.Frontend/src/App.tsx`
- Database: `WinHire.Backend/winhire.db` (auto-created)

---

## 📊 Documentation Map

```
WinHire/
│
├── 📄 INDEX.md              ← You are here
├── 📄 README.md             ← Main documentation (START HERE)
├── 📄 QUICKSTART.md         ← Fast 3-step setup
├── 📄 SUMMARY.md            ← System overview
├── 📄 FEATURES.md           ← Complete feature list
├── 📄 TESTING.md            ← Testing guide
│
├── 🔧 START.ps1             ← Interactive startup
├── 🔧 VERIFY.ps1            ← System verification
├── 🔧 INFO.bat              ← Quick info
│
├── 📁 WinHire.Backend/
│   └── 📄 README.md         ← Backend guide
│
├── 📁 WinHire.Frontend/
│   └── 📄 README.md         ← Frontend guide
│
└── 📁 WinHire.Agents/
    └── 📄 README.md         ← Agents guide
```

---

## 🎓 Learning Path

### Beginner (Just want it running)
1. **[QUICKSTART.md](QUICKSTART.md)** - Get it running (5 min)
2. **[TESTING.md](TESTING.md)** - Test basic features (10 min)
3. **[README.md](README.md)** - Understand what you built (15 min)

### Intermediate (Want to understand)
1. **[README.md](README.md)** - Complete guide (15 min)
2. **[SUMMARY.md](SUMMARY.md)** - Architecture overview (10 min)
3. **[FEATURES.md](FEATURES.md)** - Feature deep-dive (10 min)
4. Component READMEs - Specific components (5 min each)

### Advanced (Want to customize)
1. All above documentation
2. **[TESTING.md](TESTING.md)** - Full test suite
3. Source code exploration
4. Backend/Frontend/Agent READMEs for details

---

## 📞 Help & Support

### Documentation Issues
- All documentation is in Markdown format
- Open with any text editor or Markdown viewer
- GitHub renders Markdown automatically

### System Issues
1. Run **[VERIFY.ps1](VERIFY.ps1)** first
2. Check **[README.md](README.md)** Troubleshooting
3. Review **[TESTING.md](TESTING.md)** Common Issues
4. Check terminal logs for errors

---

## ✅ Documentation Checklist

Use this to track which docs you've read:

**Getting Started**
- [ ] QUICKSTART.md - Fast setup
- [ ] README.md - Complete guide
- [ ] VERIFY.ps1 - Ran verification

**Understanding**
- [ ] SUMMARY.md - System overview
- [ ] FEATURES.md - Feature list
- [ ] Architecture diagrams in README.md

**Components**
- [ ] WinHire.Backend/README.md
- [ ] WinHire.Frontend/README.md
- [ ] WinHire.Agents/README.md

**Testing**
- [ ] TESTING.md - Test guide
- [ ] Completed basic tests
- [ ] System running successfully

**Customization**
- [ ] Reviewed source code
- [ ] Understood configuration files
- [ ] Made custom modifications

---

## 🎯 Most Common Workflows

### First Time Setup
```
1. Read QUICKSTART.md
2. Run VERIFY.ps1
3. Run START.ps1
4. Open http://localhost:5173
5. Follow TESTING.md Test 1-6
```

### Daily Development
```
1. cd WinHire.Backend; dotnet run
2. cd WinHire.Frontend; npm run dev
3. cd WinHire.Agents; python agent_intake.py
4. Open http://localhost:5173
```

### Troubleshooting
```
1. Run VERIFY.ps1
2. Check README.md Troubleshooting
3. Review TESTING.md Common Issues
4. Check terminal logs
```

---

## 📝 Notes

- All scripts require **PowerShell** (except INFO.bat)
- Documentation assumes **Windows** environment
- Paths use **Windows** format (`\` separator)
- Prerequisites: .NET 8, Node.js 18+, Python 3.9+

---

## 🚀 Ready to Start?

**If you're new:** Start with **[QUICKSTART.md](QUICKSTART.md)**  
**If you want details:** Start with **[README.md](README.md)**  
**If you want overview:** Start with **[SUMMARY.md](SUMMARY.md)**

---

**Welcome to WinHire!** 🎉  
*Enterprise Candidate Management Made Simple*
