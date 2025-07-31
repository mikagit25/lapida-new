#!/bin/bash
# Автоматическая установка и настройка Lapida на VPS/VDS
# Скрипт для Hoster.by с SSH доступом

echo "🚀 Автоматическая установка Lapida на VPS..."
echo "=================================================="

# Функция для проверки команд
check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        echo "✅ $1 найден"
        return 0
    else
        echo "❌ $1 не найден"
        return 1
    fi
}

# Функция установки Node.js через NodeSource
install_nodejs() {
    echo "📦 Установка Node.js..."
    
    # Проверяем систему
    if [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [ -f /etc/redhat-release ]; then
        # CentOS/RHEL
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
    else
        echo "❌ Не удалось определить систему. Установите Node.js вручную"
        exit 1
    fi
}

# Проверка и установка зависимостей
echo "🔍 Проверка системы..."

# Проверяем Node.js
if ! check_command node; then
    echo "🔧 Устанавливаем Node.js..."
    install_nodejs
fi

# Проверяем npm
if ! check_command npm; then
    echo "❌ npm не найден после установки Node.js"
    exit 1
fi

# Показываем версии
echo "📋 Информация о системе:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Система: $(uname -a)"

# Проверяем MongoDB
if ! check_command mongod; then
    echo "⚠️ MongoDB не найден. Устанавливаем..."
    if [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        sudo apt-get update
        sudo apt-get install -y mongodb-org
        sudo systemctl start mongod
        sudo systemctl enable mongod
    else
        echo "⚠️ Установите MongoDB вручную для вашей системы"
    fi
fi

# Переходим в папку проекта
cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)
echo "📁 Рабочая папка: $PROJECT_DIR"

# Проверяем структуру проекта
echo "🔍 Проверка файлов проекта..."
REQUIRED_FILES=("app.js" "package.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file найден"
    else
        echo "❌ $file не найден"
        exit 1
    fi
done

# Останавливаем старые процессы
echo "🛑 Остановка старых процессов..."
pkill -f "node.*app.js" || true

# Установка зависимостей
echo "📦 Установка зависимостей npm..."
npm install

# Проверяем установку
if [ $? -eq 0 ]; then
    echo "✅ Зависимости установлены успешно"
else
    echo "❌ Ошибка установки зависимостей"
    echo "Попробуем альтернативный способ..."
    rm -rf node_modules package-lock.json
    npm cache clean --force
    npm install --no-optional --production
fi

# Создание безопасного JWT секрета
echo "🔑 Генерация JWT секрета..."
JWT_SECRET=$(openssl rand -hex 32)

# Создание .env файла
echo "⚙️ Создание конфигурации..."
cat > .env << EOF
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lapida_db
JWT_SECRET=$JWT_SECRET
EOF

echo "✅ .env файл создан"

# Создание папок для загрузок
echo "📁 Создание папок..."
mkdir -p upload/{memorials,gallery,users,timeline,misc}
chmod 755 upload
chmod 755 upload/*

# Установка PM2 для управления процессами
echo "🔧 Установка PM2..."
if ! check_command pm2; then
    npm install -g pm2
fi

# Создание конфигурации PM2
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
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Создание папки для логов
mkdir -p logs

# Запуск приложения
echo "🚀 Запуск Lapida..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Создание .htaccess для проксирования (если нужно)
cat > .htaccess << 'EOF'
RewriteEngine On

# API проксирование на Node.js приложение
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]

# Upload проксирование
RewriteCond %{REQUEST_URI} ^/upload/ [NC]
RewriteRule ^upload/(.*)$ http://localhost:3000/upload/$1 [P,L]

# React Router для фронтенда
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
EOF

# Проверка статуса
echo "📊 Проверка статуса..."
sleep 3
pm2 status

# Тест подключения
echo "🧪 Тестирование подключения..."
if curl -s http://localhost:3000 >/dev/null; then
    echo "✅ Сервер отвечает на порту 3000"
else
    echo "❌ Сервер не отвечает. Проверьте логи:"
    pm2 logs lapida --lines 10
fi

echo ""
echo "🎉 Установка завершена!"
echo "=================================================="
echo "📋 Информация:"
echo "• Приложение: lapida"
echo "• Порт: 3000"
echo "• Конфигурация: ecosystem.config.js"
echo "• Логи: ./logs/"
echo "• JWT секрет: сгенерирован автоматически"
echo ""
echo "🔧 Команды управления:"
echo "• pm2 status          - статус"
echo "• pm2 logs lapida     - логи"
echo "• pm2 restart lapida  - перезапуск"
echo "• pm2 stop lapida     - остановка"
echo ""
echo "🌐 Настройте домен на порт 3000 или используйте проксирование"
