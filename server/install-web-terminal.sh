#!/bin/bash
# Простая установка Lapida для веб-терминала хостинга
# Копируйте и вставляйте команды по блокам

echo "🚀 Установка Lapida через веб-терминал..."
echo "=================================================="

# Блок 1: Подготовка
echo "📁 Переход в папку сайта..."
cd ~/lapida.one
pwd

# Блок 2: Скачивание проекта
echo "📥 Скачивание проекта с GitHub..."
if [ -d "temp" ]; then
    rm -rf temp
fi

# Клонируем в временную папку
git clone https://github.com/mikagit25/lapida-new.git temp

# Перемещаем файлы
if [ -d "temp" ]; then
    echo "✅ Проект скачан, перемещаем файлы..."
    
    # Перемещаем все файлы из temp в текущую папку
    cp -r temp/* . 2>/dev/null || true
    cp -r temp/.* . 2>/dev/null || true
    
    # Удаляем временную папку
    rm -rf temp
    
    echo "✅ Файлы перемещены"
else
    echo "❌ Ошибка скачивания. Попробуйте вручную:"
    echo "wget https://github.com/mikagit25/lapida-new/archive/refs/heads/master.zip"
    echo "unzip master.zip"
    echo "mv lapida-new-master/* ."
    exit 1
fi

# Блок 3: Проверка файлов
echo "🔍 Проверка файлов..."
ls -la

# Проверяем ключевые файлы
if [ -f "server/app.js" ]; then
    echo "✅ server/app.js найден"
else
    echo "❌ server/app.js не найден"
    echo "Содержимое папки:"
    ls -la
    exit 1
fi

# Блок 4: Переход в папку сервера
echo "📁 Переход в папку сервера..."
cd server
pwd
ls -la

# Блок 5: Проверка Node.js
echo "🔍 Проверка Node.js..."
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js найден: $(node --version)"
else
    echo "❌ Node.js не найден"
    echo "🔧 Возможные решения:"
    echo "1. Установить через CloudLinux NodeJS Selector"
    echo "2. Обратиться в поддержку хостинга"
    echo "3. Установить вручную:"
    echo "   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -"
    echo "   apt-get install -y nodejs (если есть sudo)"
    exit 1
fi

# Блок 6: Проверка npm
echo "🔍 Проверка npm..."
if command -v npm >/dev/null 2>&1; then
    echo "✅ npm найден: $(npm --version)"
else
    echo "❌ npm не найден"
    exit 1
fi

# Блок 7: Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Зависимости установлены"
else
    echo "⚠️ Ошибка установки, пробуем альтернативный способ..."
    rm -rf node_modules package-lock.json
    npm cache clean --force
    npm install --production
fi

# Блок 8: Создание конфигурации
echo "⚙️ Создание .env файла..."
JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "lapida_secret_$(date +%s)")

cat > .env << EOF
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lapida_db
JWT_SECRET=$JWT_SECRET
EOF

echo "✅ .env файл создан"

# Блок 9: Создание папок
echo "📁 Создание папок для загрузок..."
mkdir -p upload/{memorials,gallery,users,timeline,misc}
chmod 755 upload 2>/dev/null || true
chmod 755 upload/* 2>/dev/null || true

# Блок 10: Проверка MongoDB
echo "🔍 Проверка MongoDB..."
if command -v mongod >/dev/null 2>&1; then
    echo "✅ MongoDB найден"
else
    echo "⚠️ MongoDB не найден"
    echo "💡 Возможные решения:"
    echo "1. Установить через пакетный менеджер"
    echo "2. Использовать MongoDB Atlas (облачная БД)"
    echo "3. Обратиться в поддержку хостинга"
fi

# Блок 11: PM2 или простой запуск
echo "🚀 Запуск приложения..."
if command -v pm2 >/dev/null 2>&1; then
    echo "✅ PM2 найден, используем PM2..."
    
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'lapida',
    script: './app.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF
    
    pm2 start ecosystem.config.js
    pm2 save
    pm2 list
else
    echo "⚠️ PM2 не найден, устанавливаем..."
    npm install -g pm2
    
    if [ $? -eq 0 ]; then
        echo "✅ PM2 установлен"
        pm2 start app.js --name lapida
        pm2 save
        pm2 list
    else
        echo "⚠️ Не удалось установить PM2, запускаем напрямую..."
        echo "Используйте: nohup node app.js &"
        echo "Или: screen -S lapida node app.js"
    fi
fi

# Блок 12: Создание .htaccess
echo "🔧 Создание .htaccess..."
cd ..
cat > .htaccess << 'EOF'
RewriteEngine On

# API проксирование
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]

# Upload проксирование
RewriteCond %{REQUEST_URI} ^/upload/ [NC]
RewriteRule ^upload/(.*)$ http://localhost:3000/upload/$1 [P,L]

# React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
EOF

# Блок 13: Билд фронтенда (если нужно)
if [ -d "client" ]; then
    echo "🎨 Сборка фронтенда..."
    cd client
    npm install
    npm run build
    
    # Копируем билд в корень
    if [ -d "dist" ]; then
        cp -r dist/* ../
        echo "✅ Фронтенд собран и размещен"
    fi
    cd ..
fi

echo ""
echo "🎉 Установка завершена!"
echo "=================================================="
echo "📋 Проверьте:"
echo "• http://lapida.one:3000 - Node.js сервер"
echo "• http://lapida.one - сайт"
echo ""
echo "🔧 Команды управления:"
echo "• pm2 status - статус приложений"
echo "• pm2 logs lapida - логи"
echo "• pm2 restart lapida - перезапуск"
echo ""
echo "📁 Файлы размещены в: $(pwd)"
