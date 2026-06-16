# Get absolute path of this script's directory
$PROJECT_ROOT = $PSScriptRoot
if (-not $PROJECT_ROOT) {
    $PROJECT_ROOT = Get-Location
}

# Clear the screen for a beautiful, premium visual experience
Clear-Host

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "         Starting ProjectFlow...            " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check node version
try {
    $NodeVer = & node -v
    Write-Host "[OK] Node.js detected: $NodeVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in your PATH!" -ForegroundColor Red
    Exit 1
}

# Check npm version
try {
    $NpmVer = & npm.cmd -v
    Write-Host "[OK] NPM detected: v$NpmVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] NPM is not installed or not in your PATH!" -ForegroundColor Red
    Exit 1
}

Write-Host ""
Write-Host "[INFO] Starting Backend API..." -ForegroundColor Yellow
# Run prisma generate in backend
Push-Location "$PROJECT_ROOT\backend"
try {
    Write-Host "[INFO] Running Prisma Client generation..." -ForegroundColor Gray
    & npx.cmd prisma generate
} catch {
    Write-Host "[WARNING] Prisma generate failed, trying to continue..." -ForegroundColor Yellow
}
Pop-Location

Write-Host ""
Write-Host "[INFO] Starting both servers in separate windows for clean logs..." -ForegroundColor Cyan

# 1. Start backend server in a new window using WorkingDirectory to prevent path escaping bugs
$BackendScript = "node api/server.js; Read-Host 'Backend stopped. Press Enter to close window'"
Start-Process powershell -WorkingDirectory "$PROJECT_ROOT\backend" -ArgumentList "-Command", $BackendScript -WindowStyle Normal

# 2. Start frontend server in a new window using WorkingDirectory to prevent path escaping bugs
$FrontendScript = "npm.cmd run dev; Read-Host 'Frontend stopped. Press Enter to close window'"
Start-Process powershell -WorkingDirectory "$PROJECT_ROOT\my-project" -ArgumentList "-Command", $FrontendScript -WindowStyle Normal

Write-Host ""
Write-Host "[OK] Both servers are launching!" -ForegroundColor Green
Write-Host "   - Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "   - Backend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Keep the newly opened PowerShell windows running. Close them to stop the servers." -ForegroundColor Gray
Write-Host "=============================================" -ForegroundColor Cyan
