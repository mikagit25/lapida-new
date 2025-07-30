# Запуск полного стека Lapida One
Write-Host "🚀 Запуск Lapida One..." -ForegroundColor Green

# Устанавливаем базовую директорию
$projectRoot = "d:\Mikalai\lapida-new"
Set-Location $projectRoot

Write-Host "📂 Рабочая директория: $projectRoot" -ForegroundColor Yellow

# Функция для запуска сервера
function Start-Server {
    Write-Host "🔧 Запуск сервера..." -ForegroundColor Blue
    Set-Location "$projectRoot\server"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\server'; node app.js"
}

# Функция для запуска клиента
function Start-Client {
    Write-Host "🎨 Запуск клиента..." -ForegroundColor Blue
    Set-Location "$projectRoot\client"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\client'; npm run dev"
}

# Проверяем что MongoDB запущен
Write-Host "🔍 Проверка MongoDB..." -ForegroundColor Yellow

# Запуск сервера
Start-Server
Start-Sleep -Seconds 3

# Запуск клиента
Start-Client

Write-Host "✅ Запуск завершен!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5175" -ForegroundColor Cyan
Write-Host "🔗 Backend: http://localhost:5001" -ForegroundColor Cyan

# Возвращаемся в корневую директорию
Set-Location $projectRoot
