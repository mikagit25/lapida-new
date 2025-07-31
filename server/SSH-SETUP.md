# Настройка SSH подключения к серверу

## Способ 1: Установка OpenSSH в Windows

### Через PowerShell (требует права администратора):
```powershell
# Запустите PowerShell от имени администратора
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

### Через Настройки Windows:
1. Открыть Параметры -> Приложения
2. Дополнительные компоненты -> Добавить компонент
3. Найти "Клиент OpenSSH" и установить

## Способ 2: Использование Git Bash (если установлен Git)
```bash
ssh a1compan@vh119.hoster.by
```

## Способ 3: PuTTY (графический SSH клиент)
1. Скачать PuTTY с https://www.putty.org/
2. Запустить PuTTY
3. Ввести:
   - Host Name: vh119.hoster.by
   - Port: 22
   - Username: a1compan

## Способ 4: VS Code SSH Extension
1. Установить расширение "Remote - SSH"
2. Ctrl+Shift+P -> "Remote-SSH: Connect to Host"
3. Ввести: a1compan@vh119.hoster.by

## После подключения к серверу:

### 1. Клонирование проекта:
```bash
cd ~/lapida.one
git clone https://github.com/mikagit25/lapida-new.git .
```

### 2. Запуск установки:
```bash
cd ~/lapida.one
chmod +x install.sh
./install.sh
```

## Альтернатива: Использование веб-терминала хостинга

Если SSH не работает, можно использовать веб-терминал:
1. Войти в панель управления хостингом
2. Открыть SSH Terminal
3. Выполнить команды установки

### Команды для веб-терминала:
```bash
# Переход в папку сайта
cd ~/lapida.one

# Клонирование проекта
git clone https://github.com/mikagit25/lapida-new.git temp
mv temp/* .
mv temp/.* . 2>/dev/null || true
rm -rf temp

# Запуск установки
chmod +x server/install.sh
cd server
./install.sh
```

## Проверка подключения
После установки проверьте:
- http://lapida.one:3000 - прямое подключение к Node.js
- http://lapida.one - сайт через Apache

## Troubleshooting

### Если git clone не работает:
```bash
# Проверить DNS
nslookup github.com

# Использовать IP вместо домена
git clone https://140.82.112.3/mikagit25/lapida-new.git temp
```

### Если нет прав на sudo:
- Обратиться в поддержку хостинга для установки Node.js
- Использовать Node.js через cPanel (если доступно)
- Установить через NodeJS Selector в CloudLinux
