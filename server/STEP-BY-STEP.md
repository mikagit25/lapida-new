# ПОШАГОВАЯ УСТАНОВКА LAPIDA
# Копируйте команды блоками в веб-терминал хостинга

## ШАГ 1: Переход в папку сайта
```bash
cd ~/lapida.one
pwd
ls -la
```

## ШАГ 2: Очистка папки (если нужно)
```bash
# Осторожно! Удаляет все файлы в папке
# rm -rf * .*[^.]*
```

## ШАГ 3: Скачивание проекта
```bash
# Вариант 1: Через git clone
git clone https://github.com/mikagit25/lapida-new.git temp
cp -r temp/* . 2>/dev/null
cp -r temp/.* . 2>/dev/null
rm -rf temp

# Вариант 2: Если git не работает
wget https://github.com/mikagit25/lapida-new/archive/refs/heads/master.zip
unzip master.zip
mv lapida-new-master/* .
mv lapida-new-master/.* . 2>/dev/null
rm -rf lapida-new-master master.zip
```

## ШАГ 4: Проверка файлов
```bash
ls -la
ls -la server/
```

## ШАГ 5: Переход в папку сервера
```bash
cd server
pwd
```

## ШАГ 6: Проверка Node.js
```bash
node --version
npm --version
```

## ШАГ 7: Установка зависимостей
```bash
npm install
```

## ШАГ 8: Создание .env файла
```bash
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lapida_db
JWT_SECRET=lapida_secret_key_change_me_in_production
EOF
```

## ШАГ 9: Создание папок
```bash
mkdir -p upload/{memorials,gallery,users,timeline,misc}
chmod 755 upload
chmod 755 upload/*
```

## ШАГ 10: Установка PM2 (если нужно)
```bash
npm install -g pm2
```

## ШАГ 11: Запуск приложения
```bash
# Вариант 1: Через PM2
pm2 start app.js --name lapida
pm2 save
pm2 list

# Вариант 2: Простой запуск в фоне
nohup node app.js > lapida.log 2>&1 &

# Вариант 3: Через screen
screen -S lapida
node app.js
# Ctrl+A, D для выхода из screen
```

## ШАГ 12: Проверка запуска
```bash
# Проверка процессов
ps aux | grep node

# Проверка порта
netstat -tulpn | grep 3000

# Тест подключения
curl http://localhost:3000
```

## ШАГ 13: Настройка Apache (в корне сайта)
```bash
cd ~/lapida.one
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
```

## ШАГ 14: Сборка фронтенда
```bash
cd client
npm install
npm run build

# Копирование файлов в корень
cp -r dist/* ../
cd ..
```

## ШАГ 15: Финальная проверка
```bash
# Проверка файлов
ls -la ~/lapida.one

# Проверка сервера
curl http://localhost:3000/api/health

# Проверка сайта
curl http://lapida.one
```

## КОМАНДЫ УПРАВЛЕНИЯ

### Остановка приложения:
```bash
# Через PM2
pm2 stop lapida

# Через kill
pkill -f "node.*app.js"
```

### Перезапуск:
```bash
pm2 restart lapida
```

### Просмотр логов:
```bash
# PM2 логи
pm2 logs lapida

# Файл логов
tail -f ~/lapida.one/server/lapida.log
```

### Статус:
```bash
pm2 status
```

## TROUBLESHOOTING

### Если Node.js не найден:
1. Проверить CloudLinux NodeJS Selector
2. Установить через панель управления
3. Обратиться в поддержку

### Если порт 3000 занят:
```bash
# Найти процесс
lsof -i :3000
# Убить процесс
kill -9 PID
```

### Если MongoDB не работает:
1. Использовать MongoDB Atlas
2. Установить локально (если есть права)
3. Обратиться в поддержку

### Если сайт не открывается:
1. Проверить .htaccess
2. Проверить права на файлы
3. Проверить логи Apache
