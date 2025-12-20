# WinHire Frontend

Modern React 19 + TypeScript + Tailwind CSS UI for candidate management.

## Features

- Beautiful responsive UI with Tailwind CSS
- Real-time candidate management
- Status updates with color-coded badges
- Statistics dashboard
- Add/Edit/Delete candidates
- Axios API integration

## Quick Start

```powershell
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Access at: **http://localhost:5173**

## Available Scripts

```powershell
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Status Badge Colors

| Status | Color |
|--------|-------|
| Application Received | Gray |
| Under Review | Blue |
| Shortlisted | Yellow |
| Interview Scheduled | Purple |
| Selected | Green |
| Rejected | Red |

## Project Structure

```
WinHire.Frontend/
├── src/
│   ├── api/
│   │   └── candidateApi.ts    # API integration
│   ├── pages/
│   │   └── CandidateList.tsx  # Main component
│   ├── App.tsx                # Root component
│   └── index.css              # Tailwind styles
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## Configuration

API endpoint configured in `src/api/candidateApi.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Technologies

- React 19
- TypeScript
- Tailwind CSS 3
- Vite 7
- Axios

## Features Showcase

### Dashboard Statistics
- Total candidates count
- Count by status (8 categories)
- Color-coded cards

### Candidate Management
- ➕ Add new candidate with form validation
- 🔄 Update status via dropdown
- 🗑️ Delete with confirmation
- ♻️ Manual refresh
- 📊 Real-time updates

### UI/UX
- Gradient backgrounds
- Hover effects
- Loading states
- Error handling
- Responsive design
