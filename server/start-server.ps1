# Запуск сервера Lapida
$serverPath = "d:\Mikalai\lapida-new\server"
Write-Host "🔧 Запуск сервера из: $serverPath" -ForegroundColor Blue
Set-Location $serverPath
node app.js
