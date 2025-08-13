# Массовая замена жестких ссылок на localhost:5007

$files = @(
    "client\src\services\virtualItems.js",
    "client\src\components\TimelineEvent.jsx", 
    "client\src\components\AvatarBackgroundManager.jsx",
    "client\src\components\LifeTimeline.jsx",
    "client\src\components\TestGraveGallery.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Обновление файла: $file" -ForegroundColor Yellow
        
        # Читаем содержимое файла
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Добавляем импорт API_BASE_URL если его нет
        if ($content -notmatch "import.*API_BASE_URL.*from.*config/api") {
            if ($content -match "import React") {
                $content = $content -replace "(import React[^;]*;)", "`$1`nimport { API_BASE_URL } from '../config/api';"
            } else {
                $content = "import { API_BASE_URL } from '../config/api';`n" + $content
            }
        }
        
        # Заменяем жесткие ссылки
        $content = $content -replace "http://localhost:5007", "`${API_BASE_URL}"
        $content = $content -replace "'http://localhost:5007/api/", "`'`${API_BASE_URL}/api/"
        
        # Записываем обратно
        Set-Content $file -Value $content -Encoding UTF8
        Write-Host "✅ Файл $file обновлен" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Файл $file не найден" -ForegroundColor Red
    }
}

Write-Host "Готово! Все жесткие ссылки заменены на динамические." -ForegroundColor Green
