# ==============================================================================
# Start Contestant Frontend Script - Cybersecurity CTF Platform
# Launches Contestant Portal on http://localhost:5173
# ==============================================================================

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ContestantDir = Join-Path $ProjectRoot "contestant-frontend"
Set-Location $ContestantDir

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  STARTING CTF CONTESTANT PORTAL                          " -ForegroundColor Green
Write-Host "  URL: http://localhost:5173                              " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

if (-not (Test-Path (Join-Path $ContestantDir "node_modules"))) {
    Write-Host "[INFO] Installing node_modules..." -ForegroundColor Yellow
    npm install
}

npm run dev
