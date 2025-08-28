#!/bin/bash
# deploy.sh — автоматический деплой Node.js проекта с GitHub на hoster.by

# Вход в виртуальное окружение
source /home/a1compan/nodevenv/lapida.one/10/bin/activate
cd /home/a1compan/lapida.one


# Клонирование или обновление репозитория
if [ ! -d ".git" ]; then
  git clone https://github.com/mikagit25/lapida-new.git .
else
  git pull
fi

# Удаление node_modules из корня, если есть
if [ -d "node_modules" ]; then
  rm -rf node_modules
fi

# Установка зависимостей с правильным путём node
npm install --scripts-prepend-node-path

# Сборка фронтенда (если есть)
if [ -f "client/package.json" ]; then
  cd client
  npm install
  npm run build
  cd ..
fi

# Копирование сборки фронта в public (если нужно)
if [ -d "client/dist" ]; then
  cp -r client/dist/* public/
fi

# Запуск приложения
npm start
