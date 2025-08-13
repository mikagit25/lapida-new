Write-Host "=== Проверка конфигурации проекта ===" -ForegroundColor Green

# Проверяем серверные процессы
Write-Host "`n1. Статус серверов:" -ForegroundColor Blue
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "✅ Node.js процессы запущены:" -ForegroundColor Green
    foreach ($proc in $nodeProcesses) {
        Write-Host "   PID: $($proc.Id)" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Node.js процессы не найдены" -ForegroundColor Red
}

# Проверяем порты
Write-Host "`n2. Проверка портов:" -ForegroundColor Blue
$ports = @(3000, 3001, 5007, 5182)
foreach ($port in $ports) {
    $netstat = netstat -ano | findstr ":$port "
    if ($netstat) {
        Write-Host "✅ Порт $port занят" -ForegroundColor Green
    } else {
        Write-Host "⚪ Порт $port свободен" -ForegroundColor Gray
    }
}

# Проверяем конфигурационные файлы
Write-Host "`n3. Конфигурационные файлы:" -ForegroundColor Blue

if (Test-Path "server\.env") {
    $serverEnv = Get-Content "server\.env" -Raw
    if ($serverEnv -match "PORT=(\d+)") {
        Write-Host "✅ server\.env: PORT=$($matches[1])" -ForegroundColor Green
    } else {
        Write-Host "⚠️ server\.env: PORT не установлен" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ server\.env не найден" -ForegroundColor Red
}

if (Test-Path "client\.env.local") {
    $clientEnv = Get-Content "client\.env.local" -Raw
    if ($clientEnv -match "VITE_API_URL=(.+)") {
        Write-Host "✅ client\.env.local: VITE_API_URL=$($matches[1])" -ForegroundColor Green
    } else {
        Write-Host "⚠️ client\.env.local: VITE_API_URL не установлен" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ client\.env.local не найден" -ForegroundColor Red
}

# Проверяем API доступность
Write-Host "`n4. Проверка API:" -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        $health = $response.Content | ConvertFrom-Json
        Write-Host "✅ API сервер доступен на порту $($health.port)" -ForegroundColor Green
        Write-Host "   Статус: $($health.status)" -ForegroundColor Gray
        Write-Host "   Окружение: $($health.environment)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ API сервер недоступен на порту 3000" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5007/api/health" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        $health = $response.Content | ConvertFrom-Json
        Write-Host "✅ API сервер доступен на порту $($health.port)" -ForegroundColor Green
    }
} catch {
    Write-Host "⚪ API сервер недоступен на порту 5007" -ForegroundColor Gray
}

# Проверяем клиент
Write-Host "`n5. Проверка клиента:" -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Клиент доступен на порту 3001" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Клиент недоступен на порту 3001" -ForegroundColor Red
}

Write-Host "`n=== Проверка завершена ===" -ForegroundColor Green
