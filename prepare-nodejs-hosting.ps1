# Подготовка к размещению на Node.js хостинге
Write-Host "🏗️ Подготовка Lapida для Node.js хостинга..." -ForegroundColor Green

# Сборка frontend
Write-Host "📦 Сборка frontend..." -ForegroundColor Yellow
Set-Location client
npm run build

# Создаем папку public в server
Write-Host "📁 Копирование frontend в server..." -ForegroundColor Yellow
Set-Location ../server
if (Test-Path "public") {
    Remove-Item -Recurse -Force "public"
}
New-Item -ItemType Directory -Name "public"

# Копируем dist в public
Copy-Item -Path "../client/dist/*" -Destination "public/" -Recurse -Force

Write-Host "✅ Готово! Теперь можно загружать папку server/ на Node.js хостинг" -ForegroundColor Green
Write-Host "📋 Не забудьте:" -ForegroundColor Cyan
Write-Host "   1. Установить зависимости: npm install" -ForegroundColor White
Write-Host "   2. Настроить переменные окружения" -ForegroundColor White
Write-Host "   3. Указать стартовый файл: app.js" -ForegroundColor White

Set-Location ..
