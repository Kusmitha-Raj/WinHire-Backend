# 🧪 WinHire Testing Guide

## Complete End-to-End Testing Instructions

---

## 🚀 Phase 1: System Startup

### Step 1: Verify Prerequisites
```powershell
# Run verification script
.\VERIFY.ps1
```

Expected output: All checkmarks ✓

### Step 2: Start Backend
```powershell
# Terminal 1
cd WinHire.Backend
dotnet run
```

**✅ Success Indicators:**
- "Now listening on: http://localhost:5000"
- "Database initialized"
- "WinHire Backend API started"
- No error messages

### Step 3: Start Frontend
```powershell
# Terminal 2
cd WinHire.Frontend
npm install    # First time only
npm run dev
```

**✅ Success Indicators:**
- "Local: http://localhost:5173"
- "ready in XXX ms"
- Browser opens automatically

### Step 4: Start Agent
```powershell
# Terminal 3
cd WinHire.Agents
pip install -r requirements.txt    # First time only
python agent_intake.py
```

**✅ Success Indicators:**
- "=== Candidate Intake Agent Started ==="
- "Checking every 60 seconds"
- "API URL: http://localhost:5000/api"

---

## 🧪 Phase 2: Manual Testing

### Test 1: Access Frontend
1. Open browser: http://localhost:5173
2. **Expected:** Beautiful dashboard with gradient background
3. **Expected:** Statistics showing all zeros
4. **Expected:** "No candidates yet" message

**✅ PASS if:** UI loads without errors

---

### Test 2: Access Backend API
1. Open browser: http://localhost:5000
2. **Expected:** Swagger UI documentation page
3. Click "GET /api/candidates"
4. Click "Try it out"
5. Click "Execute"
6. **Expected:** Empty array `[]`

**✅ PASS if:** API responds with 200 OK

---

### Test 3: Add Candidate (Frontend)
1. Go to http://localhost:5173
2. Click **"+ Add New Candidate"**
3. Fill form:
   - Name: `John Doe`
   - Email: `john.doe@example.com`
   - Phone: `123-456-7890`
   - Role: `Software Engineer`
4. Click **"Add Candidate"**

**✅ Expected Results:**
- Form closes
- Candidate appears in table
- Statistics update (Total: 1, No Status: 1)
- Status column shows dropdown with "-- No Status --"

**✅ PASS if:** Candidate is visible in list

---

### Test 4: Agent Auto-Update (Wait 60 seconds)
1. **Wait exactly 60 seconds**
2. Click **"🔄 Refresh"** button

**✅ Expected Results:**
- Status changed from "" to "Application Received"
- Badge appears: Gray with "Application Received"
- Statistics update (No Status: 0, Received: 1)

**✅ PASS if:** Status updated automatically

**Check Terminal 3 (Agent):**
- Should show: "✓ Candidate ID 1 status updated to 'Application Received'"

---

### Test 5: Workflow Progression (Wait another 60 seconds)
1. **Wait 60 more seconds**
2. Click **"🔄 Refresh"**

**✅ Expected Results:**
- Status: "Under Review" (Blue badge)
- Statistics: Under Review: 1

**✅ PASS if:** Status progressed

---

### Test 6: Manual Status Update
1. Click the status dropdown for John Doe
2. Select **"Selected"**
3. Wait for UI to refresh

**✅ Expected Results:**
- Badge turns green
- Status shows "Selected"
- Statistics: Selected: 1

**Check Terminal 1 (Backend):**
- Should show: "Selection email sent successfully to john.doe@example.com"
- Should show email content in logs

**✅ PASS if:** Status updated AND email logged

---

### Test 7: Add Multiple Candidates
Add 3 more candidates:

**Candidate 2:**
- Name: `Jane Smith`
- Email: `jane.smith@example.com`
- Phone: `234-567-8901`
- Role: `Product Manager`

**Candidate 3:**
- Name: `Bob Johnson`
- Email: `bob.johnson@example.com`
- Phone: `345-678-9012`
- Role: `UX Designer`

**Candidate 4:**
- Name: `Alice Williams`
- Email: `alice.williams@example.com`
- Phone: `456-789-0123`
- Role: `Data Scientist`

**✅ Expected Results:**
- Total candidates: 4
- No Status: 3 (new ones)
- Selected: 1 (John from before)

**✅ PASS if:** All 4 candidates visible

---

### Test 8: Delete Candidate
1. Click **"Delete"** for Alice Williams
2. Confirm deletion

**✅ Expected Results:**
- Confirmation dialog appears
- After confirmation, candidate removed
- Total candidates: 3

**✅ PASS if:** Candidate deleted successfully

---

### Test 9: Agent Batch Processing
1. **Wait 60 seconds**
2. Click **"🔄 Refresh"**

**✅ Expected Results:**
- Jane and Bob: "Application Received" (Gray)
- Statistics updated accordingly

**Terminal 3 should show:**
- "Processed 2 candidate(s)"

**✅ PASS if:** Multiple candidates updated

---

### Test 10: Complete Workflow Test
1. Let the agents run for 3-4 minutes
2. Refresh periodically
3. Watch Jane Smith progress through statuses:
   - No Status → Application Received (Agent 1)
   - Application Received → Under Review (Agent 2)
   - Under Review → Shortlisted (Agent 2)
   - Shortlisted → Interview Scheduled (Agent 3)

**✅ Expected Results:**
- Jane progresses automatically
- Each transition takes ~60 seconds
- Badges change colors correctly
- Statistics update after each change

**✅ PASS if:** Complete workflow executes

---

## 🔍 Phase 3: API Testing (Swagger)

### Test 11: API - Get All Candidates
1. Go to http://localhost:5000
2. GET /api/candidates → Try it out → Execute

**✅ Expected:** JSON array with all candidates

---

### Test 12: API - Get Single Candidate
1. GET /api/candidates/{id}
2. Enter ID: `1`
3. Execute

**✅ Expected:** JSON object for John Doe

---

### Test 13: API - Create Candidate
1. POST /api/candidates
2. Request body:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "999-999-9999",
  "roleApplied": "Tester",
  "status": ""
}
```
3. Execute

**✅ Expected:** 201 Created, returns created candidate with ID

---

### Test 14: API - Update Status
1. PUT /api/candidates/{id}/status
2. Enter ID: `5` (Test User)
3. Request body:
```json
{
  "status": "Selected"
}
```
4. Execute

**✅ Expected:** 
- 200 OK
- Returns updated candidate
- **Terminal 1 shows email sent log**

---

### Test 15: API - Delete Candidate
1. DELETE /api/candidates/{id}
2. Enter ID: `5`
3. Execute

**✅ Expected:** 204 No Content

---

## 🎯 Phase 4: Edge Cases & Error Testing

### Test 16: Invalid Email Status Update
1. Update candidate to "Selected"
2. Use email: `invalid-email`

**✅ Expected:**
- Status still updates
- Email fails gracefully (logged, not crash)

---

### Test 17: Backend Restart
1. Stop backend (Ctrl+C in Terminal 1)
2. In frontend, try to add candidate

**✅ Expected:**
- Error message appears
- "Failed to load candidates. Make sure the backend is running."

3. Restart backend
4. Click Refresh

**✅ Expected:**
- Data loads again
- Database persisted

---

### Test 18: Agent Without Backend
1. Stop backend
2. Check Terminal 3 (Agent)

**✅ Expected:**
- "Error fetching candidates"
- "No candidates found or API unreachable"
- Agent continues running (doesn't crash)

3. Restart backend

**✅ Expected:**
- Agent resumes normal operation

---

### Test 19: Concurrent Agents
1. Open 2 more terminals
2. Run all 3 agents simultaneously:
   - Terminal 3: `python agent_intake.py`
   - Terminal 4: `python agent_workflow.py`
   - Terminal 5: `python agent_interview.py`

3. Add new candidate
4. Watch progression

**✅ Expected:**
- No Status → Application Received → Under Review → Shortlisted → Interview Scheduled
- All transitions happen automatically
- No conflicts or errors

---

### Test 20: Database Persistence
1. Add candidate "Persistence Test"
2. Stop ALL services (Backend, Frontend, Agents)
3. Restart Backend
4. Restart Frontend
5. Check http://localhost:5173

**✅ Expected:**
- All candidates still present
- Data persisted in `winhire.db`

---

## 📊 Phase 5: Performance Testing

### Test 21: Bulk Add
1. Add 20 candidates rapidly
2. Check UI responsiveness
3. Check backend logs

**✅ Expected:**
- All candidates added successfully
- UI remains responsive
- No errors in logs

---

### Test 22: Agent Performance
1. With 20 candidates
2. Let agents run for 5 minutes
3. Monitor Terminal 3

**✅ Expected:**
- Processes all candidates
- No memory leaks
- Consistent timing (~60s intervals)

---

## ✅ Test Results Checklist

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Frontend Access | ⬜ | |
| 2 | Backend API | ⬜ | |
| 3 | Add Candidate | ⬜ | |
| 4 | Agent Auto-Update | ⬜ | |
| 5 | Workflow Progression | ⬜ | |
| 6 | Manual Status Update | ⬜ | |
| 7 | Multiple Candidates | ⬜ | |
| 8 | Delete Candidate | ⬜ | |
| 9 | Agent Batch Processing | ⬜ | |
| 10 | Complete Workflow | ⬜ | |
| 11 | API Get All | ⬜ | |
| 12 | API Get Single | ⬜ | |
| 13 | API Create | ⬜ | |
| 14 | API Update Status | ⬜ | |
| 15 | API Delete | ⬜ | |
| 16 | Invalid Email | ⬜ | |
| 17 | Backend Restart | ⬜ | |
| 18 | Agent Without Backend | ⬜ | |
| 19 | Concurrent Agents | ⬜ | |
| 20 | Database Persistence | ⬜ | |
| 21 | Bulk Add | ⬜ | |
| 22 | Agent Performance | ⬜ | |

---

## 🎓 Expected Terminal Outputs

### Terminal 1 (Backend) - Successful Run
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
info: WinHire.Backend.Program[0]
      Database initialized
info: WinHire.Backend.Program[0]
      WinHire Backend API started at http://localhost:5000
```

### Terminal 2 (Frontend) - Successful Run
```
  VITE v7.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Terminal 3 (Agent) - Successful Run
```
2025-12-20 10:30:00,123 - CandidateIntakeAgent - INFO - === Candidate Intake Agent Started ===
2025-12-20 10:30:00,124 - CandidateIntakeAgent - INFO - Checking every 60 seconds
2025-12-20 10:30:00,125 - CandidateIntakeAgent - INFO - API URL: http://localhost:5000/api/candidates
2025-12-20 10:30:00,126 - CandidateIntakeAgent - INFO - Starting candidate intake processing...
```

---

## 🐛 Common Issues & Solutions

### Issue: "Port 5000 already in use"
**Solution:** Kill process on port 5000 or change backend port in appsettings.json

### Issue: "Cannot connect to database"
**Solution:** Delete winhire.db and restart backend

### Issue: "npm install fails"
**Solution:** Clear cache: `npm cache clean --force`, then retry

### Issue: "Agent not updating candidates"
**Solution:** Ensure backend is running and accessible at http://localhost:5000

### Issue: "Frontend shows loading forever"
**Solution:** Check backend is running, check CORS settings

---

## 📝 Testing Notes

- **Timing:** Agent checks every 60 seconds (configurable)
- **Email:** If SMTP not configured, emails are logged only
- **Database:** SQLite file `winhire.db` in Backend folder
- **Logs:** All terminals show detailed logs
- **Refresh:** Manual refresh needed to see agent updates

---

## 🏆 Success Criteria

**System is working correctly if:**

✅ All services start without errors  
✅ Frontend loads and displays UI  
✅ Can add/delete candidates  
✅ Agents update statuses automatically  
✅ Manual status updates work  
✅ Email logs appear when status = "Selected"  
✅ Statistics update correctly  
✅ Data persists after restart  
✅ API responds to all endpoints  
✅ No crashes or errors in any terminal  

---

**Happy Testing! 🚀**

If all tests pass, your WinHire system is **production-ready**! ✅
