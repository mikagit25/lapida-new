# Запуск полного стека Lapida
Write-Host "🚀 Запуск Lapida..." -ForegroundColor Green

# Устанавливаем базовую директорию
$projectRoot = "d:\Mikalai\lapida-new"
Set-Location $projectRoot

Write-Host "📂 Рабочая директория: $projectRoot" -ForegroundColor Yellow

# Проверяем переменные окружения для портов
$SERVER_PORT = if ($env:PORT) { $env:PORT } else { 5007 }
$CLIENT_PORT = if ($env:CLIENT_PORT) { $env:CLIENT_PORT } else { 5182 }

Write-Host "🔧 Сервер будет запущен на порту: $SERVER_PORT" -ForegroundColor Yellow
Write-Host "🎨 Клиент будет запущен на порту: $CLIENT_PORT" -ForegroundColor Yellow

# Функция для запуска сервера
function Start-Server {
    Write-Host "🔧 Запуск сервера..." -ForegroundColor Blue
    Set-Location "$projectRoot\server"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\server'; `$env:PORT='$SERVER_PORT'; node app.js"
}

# Функция для запуска клиента
function Start-Client {
    Write-Host "🎨 Запуск клиента..." -ForegroundColor Blue
    Set-Location "$projectRoot\client"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\client'; `$env:VITE_API_URL='http://localhost:$SERVER_PORT'; npm run dev -- --port $CLIENT_PORT"
}

# Проверяем что MongoDB запущен
Write-Host "🔍 Проверка MongoDB..." -ForegroundColor Yellow

# Запуск сервера
Start-Server
Start-Sleep -Seconds 3

# Запуск клиента
Start-Client

Write-Host "✅ Запуск завершен!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:$CLIENT_PORT" -ForegroundColor Cyan
Write-Host "🔗 Backend: http://localhost:$SERVER_PORT" -ForegroundColor Cyan

# Возвращаемся в корневую директорию
Set-Location $projectRoot
