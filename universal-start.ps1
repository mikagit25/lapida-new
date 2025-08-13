param(
    [int]$PreferredServerPort = 3000,
    [int]$PreferredClientPort = 3001,
    [string]$Environment = "development",
    [switch]$AutoDetect = $true,
    [switch]$Force = $false
)

Write-Host "🚀 Универсальный запуск Lapida" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Gray

# Функция для проверки доступности порта
function Test-Port {
    param([int]$Port)
    try {
        $tcpListener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $Port)
        $tcpListener.Start()
        $tcpListener.Stop()
        return $true
    }
    catch {
        return $false
    }
}

# Функция для поиска свободного порта
function Find-FreePort {
    param([int]$StartPort)
    $port = $StartPort
    while (-not (Test-Port $port)) {
        $port++
        if ($port -gt 65535) {
            throw "Не удалось найти свободный порт"
        }
    }
    return $port
}

# Функция для определения окружения
function Detect-Environment {
    # Проверяем наличие характерных файлов хостинга
    if (Test-Path "vercel.json") { return "vercel" }
    if (Test-Path "netlify.toml") { return "netlify" }
    if (Test-Path "Procfile") { return "heroku" }
    if (Test-Path "docker-compose.yml") { return "docker" }
    if ($env:NODE_ENV -eq "production") { return "production" }
    return "development"
}

# Функция для остановки существующих процессов
function Stop-ExistingProcesses {
    param([switch]$Force)
    
    Write-Host "🔍 Проверка существующих процессов..." -ForegroundColor Yellow
    
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Write-Host "Найдено $($nodeProcesses.Count) Node.js процессов" -ForegroundColor Yellow
        if ($Force) {
            Write-Host "🛑 Принудительная остановка всех Node.js процессов..." -ForegroundColor Red
            $nodeProcesses | ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }
            Start-Sleep -Seconds 2
        } else {
            Write-Host "⚠️  Используйте параметр -Force для остановки существующих процессов" -ForegroundColor Yellow
        }
    }
}

# Функция для создания конфигурационных файлов
function Create-ConfigFiles {
    param(
        [string]$ServerPort,
        [string]$ClientPort,
        [string]$Environment
    )
    
    Write-Host "📝 Создание конфигурационных файлов..." -ForegroundColor Blue
    
    # Создаем .env для сервера
    $serverEnvContent = @"
NODE_ENV=$Environment
PORT=$ServerPort
MONGODB_URI=mongodb://localhost:27017/lapida_db
JWT_SECRET=your_jwt_secret_key_here
"@
    
    Set-Content -Path "server\.env" -Value $serverEnvContent -Encoding UTF8
    Write-Host "✅ Создан server\.env" -ForegroundColor Green
    
    # Создаем .env.local для клиента
    $clientEnvContent = @"
VITE_API_URL=http://localhost:$ServerPort
VITE_APP_ENV=$Environment
"@
    
    Set-Content -Path "client\.env.local" -Value $clientEnvContent -Encoding UTF8
    Write-Host "✅ Создан client\.env.local" -ForegroundColor Green
}

# Функция для проверки зависимостей
function Check-Dependencies {
    Write-Host "🔍 Проверка зависимостей..." -ForegroundColor Blue
    
    # Проверяем Node.js
    try {
        $nodeVersion = node --version
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js не найден!" -ForegroundColor Red
        return $false
    }
    
    # Проверяем npm
    try {
        $npmVersion = npm --version
        Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ npm не найден!" -ForegroundColor Red
        return $false
    }
    
    # Проверяем node_modules в сервере
    if (-not (Test-Path "server\node_modules")) {
        Write-Host "📦 Установка зависимостей сервера..." -ForegroundColor Yellow
        Set-Location "server"
        npm install
        Set-Location ".."
    }
    
    # Проверяем node_modules в клиенте
    if (-not (Test-Path "client\node_modules")) {
        Write-Host "📦 Установка зависимостей клиента..." -ForegroundColor Yellow
        Set-Location "client"
        npm install
        Set-Location ".."
    }
    
    return $true
}

# Основная логика
try {
    # Определяем текущее окружение
    $DetectedEnvironment = Detect-Environment
    Write-Host "🌍 Окружение: $DetectedEnvironment" -ForegroundColor Cyan
    
    # Останавливаем существующие процессы если нужно
    Stop-ExistingProcesses -Force:$Force
    
    # Проверяем зависимости
    if (-not (Check-Dependencies)) {
        throw "Проверка зависимостей не пройдена"
    }
    
    # Определяем порты
    if ($AutoDetect) {
        Write-Host "🔍 Автоматический поиск свободных портов..." -ForegroundColor Yellow
        $ServerPort = Find-FreePort $PreferredServerPort
        $ClientPort = Find-FreePort $PreferredClientPort
        
        # Если порты совпадают, найдем следующий свободный для клиента
        if ($ClientPort -eq $ServerPort) {
            $ClientPort = Find-FreePort ($ServerPort + 1)
        }
    } else {
        $ServerPort = $PreferredServerPort
        $ClientPort = $PreferredClientPort
    }
    
    Write-Host "🔧 Сервер будет запущен на порту: $ServerPort" -ForegroundColor Green
    Write-Host "🎨 Клиент будет запущен на порту: $ClientPort" -ForegroundColor Green
    
    # Создаем конфигурационные файлы
    Create-ConfigFiles -ServerPort $ServerPort -ClientPort $ClientPort -Environment $DetectedEnvironment
    
    # Запуск сервера
    Write-Host "🔧 Запуск сервера..." -ForegroundColor Blue
    $serverProcess = Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$PWD\server'; `$env:PORT='$ServerPort'; node app.js"
    ) -WindowStyle Normal -PassThru
    
    Write-Host "✅ Сервер запущен (PID: $($serverProcess.Id))" -ForegroundColor Green
    
    # Ждем запуска сервера
    Write-Host "⏳ Ожидание запуска сервера..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Запуск клиента
    Write-Host "🎨 Запуск клиента..." -ForegroundColor Blue
    $clientProcess = Start-Process powershell -ArgumentList @(
        "-NoExit", 
        "-Command",
        "cd '$PWD\client'; npm run dev -- --port $ClientPort"
    ) -WindowStyle Normal -PassThru
    
    Write-Host "✅ Клиент запущен (PID: $($clientProcess.Id))" -ForegroundColor Green
    
    # Финальная информация
    Write-Host ""
    Write-Host "🎉 Проект успешно запущен!" -ForegroundColor Green
    Write-Host "=" * 50 -ForegroundColor Gray
    Write-Host "📱 Frontend: http://localhost:$ClientPort" -ForegroundColor Cyan
    Write-Host "🔗 Backend:  http://localhost:$ServerPort" -ForegroundColor Cyan  
    Write-Host "🏥 Health:   http://localhost:$ServerPort/api/health" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Информация о процессах:" -ForegroundColor Yellow
    Write-Host "   Сервер PID: $($serverProcess.Id)" -ForegroundColor Gray
    Write-Host "   Клиент PID: $($clientProcess.Id)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🛑 Для остановки:" -ForegroundColor Yellow
    Write-Host "   taskkill /f /pid $($serverProcess.Id)" -ForegroundColor Gray
    Write-Host "   taskkill /f /pid $($clientProcess.Id)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Параметры запуска:" -ForegroundColor Yellow
    Write-Host "   .\universal-start.ps1 -PreferredServerPort 4000 -PreferredClientPort 4001" -ForegroundColor Gray
    Write-Host "   .\universal-start.ps1 -Force  # Принудительная остановка существующих процессов" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Ошибка: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
