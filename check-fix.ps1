# Проверка исправления timeline создания
Write-Host "Анализ исправлений timeline маршрутов..."

# Проверяем что дублированный POST /timeline удален
$timelineRoutes = Get-Content "d:\Mikalai\lapida-new\server\routes\timeline.js" | Select-String "router\.post"
Write-Host "POST маршруты в timeline.js:"
$timelineRoutes | ForEach-Object { Write-Host "  $_" }

# Проверяем клиентский API URL
$clientAPI = Get-Content "d:\Mikalai\lapida-new\client\src\services\api.js" | Select-String "timeline.*memorial"
Write-Host "`nКлиентские API вызовы:"
$clientAPI | ForEach-Object { Write-Host "  $_" }

Write-Host "`nАнализ завершен. Попробуйте запустить сервер и клиент для тестирования."
