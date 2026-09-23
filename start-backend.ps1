# ==============================================================================
# Start Backend Script - Cybersecurity CTF Platform
# Launches FastAPI backend on http://127.0.0.1:8000
# Does NOT delete database or reset competition data
# ==============================================================================

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  STARTING CYBERSECURITY CTF BACKEND SERVICE              " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Locate Python in .venv or system
$VenvPython = Join-Path $ProjectRoot ".venv\Scripts\python.exe"
if (Test-Path $VenvPython) {
    $PythonExe = $VenvPython
    Write-Host "[OK] Using virtual environment: $VenvPython" -ForegroundColor Green
} else {
    $PythonExe = "python"
    Write-Host "[WARN] .venv not found. Falling back to system python." -ForegroundColor Yellow
}

Write-Host "[INFO] Initializing SQLite database and verifying 50 questions..." -ForegroundColor Cyan
& $PythonExe -c "from backend.app.database import init_db; from backend.app.import_questions import import_questions_to_db; init_db(); import_questions_to_db();"

Write-Host "[INFO] Starting FastAPI server on http://127.0.0.1:8000 ..." -ForegroundColor Green
& $PythonExe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
