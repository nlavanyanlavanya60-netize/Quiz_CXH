# ==============================================================================
# Start Administrator Frontend Script - Cybersecurity CTF Platform
# Launches Admin Command Center on http://localhost:5174
# ==============================================================================

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$AdminDir = Join-Path $ProjectRoot "admin-frontend"
Set-Location $AdminDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  STARTING CTF ADMINISTRATOR COMMAND CENTER               " -ForegroundColor Cyan
Write-Host "  URL: http://localhost:5174                              " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not (Test-Path (Join-Path $AdminDir "node_modules"))) {
    Write-Host "[INFO] Installing node_modules..." -ForegroundColor Yellow
    npm install
}

npm run dev
