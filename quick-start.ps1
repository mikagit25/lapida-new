param(
    [int]$ServerPort = 3000,
    [int]$ClientPort = 3001,
    [switch]$Force = $false
)

Write-Host "Universal Lapida Launcher" -ForegroundColor Green

# Stop existing processes if Force is specified
if ($Force) {
    Write-Host "Stopping existing Node.js processes..." -ForegroundColor Yellow
    taskkill /f /im node.exe 2>$null
    Start-Sleep -Seconds 2
}

# Create server .env file
$serverEnvContent = @"
NODE_ENV=development
PORT=$ServerPort
MONGODB_URI=mongodb://localhost:27017/lapida_db
JWT_SECRET=your_jwt_secret_key_here
"@

Set-Content -Path "server\.env" -Value $serverEnvContent -Encoding UTF8
Write-Host "Created server\.env" -ForegroundColor Green

# Create client .env.local file
$clientEnvContent = @"
VITE_API_URL=http://localhost:$ServerPort
VITE_APP_ENV=development
"@

Set-Content -Path "client\.env.local" -Value $clientEnvContent -Encoding UTF8
Write-Host "Created client\.env.local" -ForegroundColor Green

Write-Host "Server will run on port: $ServerPort" -ForegroundColor Green
Write-Host "Client will run on port: $ClientPort" -ForegroundColor Green

# Start server
Write-Host "Starting server..." -ForegroundColor Blue
$serverJob = Start-Job -ScriptBlock {
    param($ServerPort, $ProjectPath)
    Set-Location "$ProjectPath\server"
    $env:PORT = $ServerPort
    node app.js
} -ArgumentList $ServerPort, $PWD

# Wait for server to start
Start-Sleep -Seconds 4

# Start client
Write-Host "Starting client..." -ForegroundColor Blue
$clientJob = Start-Job -ScriptBlock {
    param($ClientPort, $ProjectPath)
    Set-Location "$ProjectPath\client"
    npm run dev -- --port $ClientPort
} -ArgumentList $ClientPort, $PWD

Write-Host "Project started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:$ClientPort" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:$ServerPort" -ForegroundColor Cyan
Write-Host "Health: http://localhost:$ServerPort/api/health" -ForegroundColor Cyan

Write-Host "To stop processes, use:" -ForegroundColor Yellow
Write-Host "Stop-Job $($serverJob.Id); Stop-Job $($clientJob.Id)" -ForegroundColor Gray
