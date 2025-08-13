# Скрипт запуска Lapida
Write-Host "Запускаем Lapida..." -ForegroundColor Green

# Проверяем переменные окружения для портов
$SERVER_PORT = if ($env:PORT) { $env:PORT } else { 5007 }
$CLIENT_PORT = if ($env:CLIENT_PORT) { $env:CLIENT_PORT } else { 5182 }

Write-Host "Сервер будет запущен на порту: $SERVER_PORT" -ForegroundColor Yellow
Write-Host "Клиент будет запущен на порту: $CLIENT_PORT" -ForegroundColor Yellow

# Запуск сервера в фоне
Write-Host "Запуск сервера..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Mikalai\lapida-new\server'; `$env:PORT='$SERVER_PORT'; node app.js" -WindowStyle Normal

# Ждем 3 секунды
Start-Sleep -Seconds 3

# Запуск клиента
Write-Host "Запуск клиента..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Mikalai\lapida-new\client'; `$env:VITE_API_URL='http://localhost:$SERVER_PORT'; npm run dev -- --port $CLIENT_PORT" -WindowStyle Normal

Write-Host "Проект запущен!" -ForegroundColor Green
Write-Host "Frontend будет доступен на: http://localhost:$CLIENT_PORT" -ForegroundColor Cyan
Write-Host "Backend работает на: http://localhost:$SERVER_PORT" -ForegroundColor Cyan
