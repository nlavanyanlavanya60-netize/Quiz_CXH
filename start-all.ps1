# ==============================================================================
# Start All Services Script - Cybersecurity CTF Platform
# Launches:
#   1. FastAPI Backend (http://127.0.0.1:8000)
#   2. Contestant Portal (http://localhost:5173)
#   3. Admin Command Center (http://localhost:5174)
# ==============================================================================

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  LAUNCHING COMPLETE CYBERSECURITY CTF QUIZ PLATFORM     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [1] Backend API:        http://127.0.0.1:8000           " -ForegroundColor White
Write-Host " [2] Contestant Portal:  http://localhost:5173           " -ForegroundColor Green
Write-Host " [3] Admin Dashboard:    http://localhost:5174           " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Start Backend in a new window
$BackendScript = Join-Path $ProjectRoot "start-backend.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-File `"$BackendScript`"" -WindowStyle Normal

# Wait 2 seconds for backend initialization
Start-Sleep -Seconds 2

# Start Contestant Frontend in a new window
$ContestantScript = Join-Path $ProjectRoot "start-contestant.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-File `"$ContestantScript`"" -WindowStyle Normal

# Start Admin Frontend in a new window
$AdminScript = Join-Path $ProjectRoot "start-admin.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-File `"$AdminScript`"" -WindowStyle Normal

Write-Host "[SUCCESS] All three services have been launched in separate terminal windows." -ForegroundColor Green
Write-Host "Press any key or close this window when done." -ForegroundColor Gray
