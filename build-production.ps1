# Скрипт сборки проекта для production
Write-Host "🏗️ Сборка Lapida для production..." -ForegroundColor Green

# Переходим в папку клиента
Set-Location client

Write-Host "📦 Установка зависимостей клиента..." -ForegroundColor Yellow
npm install

Write-Host "🔨 Сборка клиента..." -ForegroundColor Yellow
npm run build

Write-Host "✅ Сборка клиента завершена!" -ForegroundColor Green

# Возвращаемся в корневую папку
Set-Location ..

Write-Host "🎉 Проект готов к деплою!" -ForegroundColor Green
Write-Host "📁 Файлы для загрузки находятся в папке client/dist/" -ForegroundColor Cyan
