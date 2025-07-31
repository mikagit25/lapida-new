# Автоматическая установка Lapida на VPS/VDS
# PowerShell версия для Windows серверов

Write-Host "🚀 Автоматическая установка Lapida на Windows VPS..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

# Функция проверки команд
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        Write-Host "✅ $Command найден" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ $Command не найден" -ForegroundColor Red
        return $false
    }
}

# Проверка Node.js
Write-Host "🔍 Проверка системы..." -ForegroundColor Yellow

if (!(Test-Command node)) {
    Write-Host "📦 Скачайте и установите Node.js с https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "После установки перезапустите скрипт" -ForegroundColor Yellow
    exit 1
}

if (!(Test-Command npm)) {
    Write-Host "❌ npm не найден" -ForegroundColor Red
    exit 1
}

# Показываем версии
Write-Host "📋 Информация о системе:" -ForegroundColor Cyan
Write-Host "Node.js: $(node --version)" -ForegroundColor White
Write-Host "npm: $(npm --version)" -ForegroundColor White

# Переходим в папку проекта
$ProjectDir = $PSScriptRoot
Set-Location $ProjectDir
Write-Host "📁 Рабочая папка: $ProjectDir" -ForegroundColor White

# Проверяем файлы проекта
Write-Host "🔍 Проверка файлов проекта..." -ForegroundColor Yellow
$RequiredFiles = @("app.js", "package.json")
foreach ($file in $RequiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file найден" -ForegroundColor Green
    } else {
        Write-Host "❌ $file не найден" -ForegroundColor Red
        exit 1
    }
}

# Остановка старых процессов
Write-Host "🛑 Остановка старых процессов..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node" -and $_.MainModule.FileName -like "*app.js*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Установка зависимостей
Write-Host "📦 Установка зависимостей npm..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Зависимости установлены успешно" -ForegroundColor Green
} else {
    Write-Host "❌ Ошибка установки зависимостей" -ForegroundColor Red
    Write-Host "Попробуем альтернативный способ..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    Remove-Item package-lock.json -ErrorAction SilentlyContinue
    npm cache clean --force
    npm install --no-optional --production
}

# Генерация JWT секрета
Write-Host "🔑 Генерация JWT секрета..." -ForegroundColor Yellow
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
$JwtSecret = [Convert]::ToBase64String($bytes)

# Создание .env файла
Write-Host "⚙️ Создание конфигурации..." -ForegroundColor Yellow
$EnvContent = @"
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lapida_db
JWT_SECRET=$JwtSecret
"@

Set-Content -Path ".env" -Value $EnvContent
Write-Host "✅ .env файл создан" -ForegroundColor Green

# Создание папок
Write-Host "📁 Создание папок..." -ForegroundColor Yellow
$Folders = @("upload", "upload/memorials", "upload/gallery", "upload/users", "upload/timeline", "upload/misc", "logs")
foreach ($folder in $Folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "✅ Создана папка: $folder" -ForegroundColor Green
    }
}

# Установка PM2
Write-Host "🔧 Установка PM2..." -ForegroundColor Yellow
if (!(Test-Command pm2)) {
    npm install -g pm2
}

# Создание конфигурации PM2
$PM2Config = @"
module.exports = {
  apps: [{
    name: 'lapida',
    script: './app.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
"@

Set-Content -Path "ecosystem.config.js" -Value $PM2Config

# Запуск приложения
Write-Host "🚀 Запуск Lapida..." -ForegroundColor Green
pm2 start ecosystem.config.js
pm2 save

# Проверка статуса
Write-Host "📊 Проверка статуса..." -ForegroundColor Yellow
Start-Sleep 3
pm2 status

Write-Host ""
Write-Host "🎉 Установка завершена!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "📋 Информация:" -ForegroundColor Cyan
Write-Host "• Приложение: lapida" -ForegroundColor White
Write-Host "• Порт: 3000" -ForegroundColor White
Write-Host "• Конфигурация: ecosystem.config.js" -ForegroundColor White
Write-Host "• Логи: ./logs/" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Команды управления:" -ForegroundColor Cyan
Write-Host "• pm2 status          - статус" -ForegroundColor White
Write-Host "• pm2 logs lapida     - логи" -ForegroundColor White
Write-Host "• pm2 restart lapida  - перезапуск" -ForegroundColor White
Write-Host "• pm2 stop lapida     - остановка" -ForegroundColor White
