# Cybersecurity Capture The Flag (CTF) Quiz Platform

A complete, production-quality, server-authoritative Cybersecurity CTF Quiz Platform built with **Python FastAPI**, **SQLite**, and **React.js**.

Designed for high-integrity cybersecurity competitions, university hackathons, and corporate defense assessments.

---

## Key Features & Security Architecture

- **Authoritative 50-Question Engine**: Rigorously parsed from `C:\CTF\questions\CTF_Challenge_50_Questions.txt`.
  - **Tier A (Easy)**: Q1 – Q15 (15 Questions | 30 Marks)
  - **Tier B (Medium)**: Q16 – Q30 (15 Questions | 30 Marks)
  - **Tier C (Hard)**: Q31 – Q50 (20 Questions | 40 Marks)
  - **Total**: Exactly 50 Questions | 100 Marks.
- **Server-Authoritative 30-Minute Timer**: The timer is held and validated on the backend. Page refreshes, browser reopens, or network blips cannot reset the countdown.
- **Window Visibility & Focus Anti-Cheat**: Tab switching, minimizing, or leaving the quiz window immediately triggers automatic submission and locks the attempt.
- **Strict Contestant Result Privacy**: Contestants **never** see scores, rankings, marks, correct counts, wrong counts, or answer keys. Post-submission confirmation returns only status acknowledgment.
- **Segregated Administrator Website**: Running on an isolated port (`http://localhost:5174`) with authenticated sessions, live statistics bento-grid, Top 5 rankings with submission-time tiebreakers, full audit tables, and session termination controls.
- **Single Active Session**: Only one concurrent browser session per team. Prevents credential sharing or multi-device cheating.
- **Argon2id & Cryptographic Passwords**: Passwords generated randomly on the backend (`secrets.token_urlsafe`) and hashed with Argon2id. Stored in SQLite (`backend/ctf_quiz.db`).
- **Live Wallpaper Cyber Background**: Ultra-lightweight HTML5 canvas rendering slow network nodes and connecting lines. `pointer-events: none` ensures zero interference with UI. Respects `prefers-reduced-motion`.
- **Authoritative Design System**: Grounded in `C:\CTF\skills\awesome-design-skills-main` (`matrix`, `glassmorphism`, `bento`, `mono`, `futuristic`, `sleek`, `premium`).

---

## Directory Structure

```
C:\CTF
├── backend
│   ├── app
│   │   ├── main.py              # FastAPI application, CORS, security middleware
│   │   ├── database.py          # SQLite connection manager, WAL mode, tables
│   │   ├── models.py            # Data entity definitions
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── auth.py              # Argon2id hashing, session token management
│   │   ├── security.py          # Team name validation, rate limiting, sanitization
│   │   ├── quiz.py              # Server timer, randomization, answer save, scoring
│   │   ├── admin.py             # Analytics, ranking with tiebreaker, session controls
│   │   ├── import_questions.py  # Strict 50-question text parser & importer
│   │   └── routers
│   │       ├── contestant.py    # Contestant API endpoints
│   │       └── admin.py         # Administrator API endpoints
│   ├── create_admin.py          # CLI script to securely create administrator credentials
│   ├── reset_database.py        # Safe explicit DB reset script
│   ├── test_backend.py          # Automated backend integration test suite
│   ├── requirements.txt         # Python dependencies
│   └── ctf_quiz.db              # Authoritative SQLite database
├── contestant-frontend          # React Contestant Portal (Port 5173)
│   ├── src
│   │   ├── components           # LiveWallpaper, Navbar, TimerHUD, QuestionNav, etc.
│   │   ├── pages                # LandingPage, RegisterPage, LoginPage, QuizPage, SubmittedPage
│   │   ├── services/api.js      # Contestant API client
│   │   └── styles/index.css     # Cyber design system tokens & glassmorphism
│   ├── package.json
│   └── vite.config.js
├── admin-frontend               # React Administrator Command Center (Port 5174)
│   ├── src
│   │   ├── components           # StatCard, TopTeamsTable, TeamsTable, ResultsTable, etc.
│   │   ├── pages                # AdminLoginPage, AdminDashboard
│   │   ├── services/api.js      # Admin API client
│   │   └── styles/index.css     # Command center styling
│   ├── package.json
│   └── vite.config.js
├── questions
│   └── CTF_Challenge_50_Questions.txt # Authoritative 50 questions source file
├── skills
│   └── awesome-design-skills-main    # Authoritative design skills repository
├── start-backend.ps1            # Launches backend server on port 8000
├── start-contestant.ps1         # Launches contestant UI on port 5173
├── start-admin.ps1              # Launches administrator UI on port 5174
├── start-all.ps1                # Launches all services concurrently
└── README.md
```

---

## Local Setup Instructions (Windows PowerShell)

### Prerequisites
- Python 3.12+ installed
- Node.js v20+ and npm installed

### 1. Virtual Environment & Backend Setup
Open PowerShell in `C:\CTF`:
```powershell
cd C:\CTF
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

### 2. Frontend Dependencies Installation
```powershell
cd C:\CTF\contestant-frontend
npm install

cd C:\CTF\admin-frontend
npm install
```

### 3. Initialize Administrator Account
Run the secure administrator initialization script:
```powershell
cd C:\CTF
.\.venv\Scripts\python.exe -m backend.create_admin
```
Follow the interactive prompts to enter your desired username and password.

---

## Running the Platform

You can start all three services simultaneously or individually:

### Option A: Start Everything Concurrently (Recommended)
Run:
```powershell
cd C:\CTF
.\start-all.ps1
```
This will launch 3 organized PowerShell windows for Backend, Contestant Portal, and Admin Command Center.

### Option B: Start Individually
- **Backend**:
  ```powershell
  cd C:\CTF
  .\start-backend.ps1
  ```
  Runs on: `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/api/docs`)

- **Contestant Portal**:
  ```powershell
  cd C:\CTF
  .\start-contestant.ps1
  ```
  Runs on: `http://localhost:5173`

- **Admin Command Center**:
  ```powershell
  cd C:\CTF
  .\start-admin.ps1
  ```
  Runs on: `http://localhost:5174`

---

## Verification & Automated Testing

To run the complete automated test suite verifying question imports, registration validation, single active sessions, timer expiration, privacy guarantees, anti-cheat auto-submission, and admin analytics:
```powershell
cd C:\CTF
.\.venv\Scripts\python.exe backend\test_backend.py
```

---

## Database Management

- **Database Location**: `C:\CTF\backend\ctf_quiz.db`
- **Database Reset**: To explicitly wipe all competition data and reload the 50 authoritative questions:
  ```powershell
  cd C:\CTF
  .\.venv\Scripts\python.exe -m backend.reset_database
  ```
  *(Requires typing `RESET_DATABASE` to prevent accidental data loss)*.
