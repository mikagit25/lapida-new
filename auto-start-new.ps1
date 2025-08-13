param(
    [int]$StartServerPort = 5007,
    [int]$StartClientPort = 5182
)

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

Write-Host "Автоматический запуск Lapida с проверкой портов..." -ForegroundColor Green

# Поиск свободных портов
$ServerPort = Find-FreePort $StartServerPort
$ClientPort = Find-FreePort $StartClientPort

# Если клиентский порт совпадает с серверным, найдем следующий свободный
if ($ClientPort -eq $ServerPort) {
    $ClientPort = Find-FreePort ($ServerPort + 1)
}

Write-Host "Сервер будет запущен на порту: $ServerPort" -ForegroundColor Green
Write-Host "Клиент будет запущен на порту: $ClientPort" -ForegroundColor Green

# Установка переменных окружения
$env:PORT = $ServerPort
$env:CLIENT_PORT = $ClientPort
$env:VITE_API_URL = "http://localhost:$ServerPort"

# Путь к проекту
$projectRoot = "d:\Mikalai\lapida-new"
Set-Location $projectRoot

# Создаем временный .env.local файл для клиента
$envContent = "VITE_API_URL=http://localhost:$ServerPort"
$envPath = "$projectRoot\client\.env.local"
Set-Content -Path $envPath -Value $envContent

# Запуск сервера
Write-Host "Запуск сервера на порту $ServerPort..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\server'; `$env:PORT='$ServerPort'; node app.js" -WindowStyle Normal

# Ждем запуска сервера
Start-Sleep -Seconds 4

# Запуск клиента
Write-Host "Запуск клиента на порту $ClientPort..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\client'; npm run dev -- --port $ClientPort" -WindowStyle Normal

Write-Host "Проект запущен!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:$ClientPort" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:$ServerPort" -ForegroundColor Cyan
Write-Host ""
Write-Host "Совет: Если нужно запустить на конкретных портах, используйте:" -ForegroundColor Yellow
Write-Host "   .\auto-start-new.ps1 -StartServerPort 3000 -StartClientPort 3001" -ForegroundColor Gray
Write-Host ""
Write-Host "Для остановки: нажмите Ctrl+C в окнах сервера и клиента" -ForegroundColor Yellow
