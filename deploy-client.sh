#!/bin/bash
# Автоматический деплой фронта lapida.one
# Запускать из корня проекта (например: bash deploy-client.sh)

set -e

# 1. Обновить репозиторий

echo "[deploy] git pull..."
git pull

# 2. Перейти в папку client и собрать фронт

echo "[deploy] npm install и build..."
cd client
npm install
npm run build

# 3. Скопировать свежую сборку в папку, которую раздаёт nginx

echo "[deploy] Копирование dist/* в /var/www/lapida-client..."
cp -r dist/* /var/www/lapida-client/

# 4. Вернуться в корень проекта
cd ..

# 5. Перезапустить nginx (если нужно, раскомментируйте строку ниже)
# sudo systemctl reload nginx

echo "[deploy] Готово! Проверьте сайт в режиме инкогнито."
