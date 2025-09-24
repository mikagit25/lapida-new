# Lapida Token Platform — Security Audit Checklist

## Smart Contracts
- [x] Проверка на reentrancy (ReentrancyGuard, тесты)
- [x] Проверка на переполнение/underflow (SafeMath, >=0.8.0)
- [x] Проверка разрешений (Ownable, AccessControl)
- [x] Проверка событий (emit Event)
- [x] Проверка на блокировку средств (withdraw, emergencyWithdraw)
- [x] Аудит сторонних библиотек (OpenZeppelin)

## Frontend
- [x] Проверка XSS (sanitize user input)
- [x] Проверка CSRF (токены, CORS)
- [x] Проверка безопасности хранения ключей (нет приватных ключей в коде)
- [x] Проверка безопасности взаимодействия с web3 (MetaMask, WalletConnect)
- [x] Проверка HTTPS для всех API

## Backend
- [x] Проверка авторизации и валидации данных
- [x] Проверка безопасности API (rate limit, CORS)
- [x] Логирование и мониторинг операций
- [x] Защита от SQL/NoSQL injection (если используется БД)

## DevOps
- [x] Использование .env для секретов
- [x] Регулярные обновления зависимостей
- [x] Аудит npm/pip пакетов
- [x] Резервное копирование данных

## Документация
- [x] Whitepaper, Tokenomics, Security Guide, Terms & Privacy

## Рекомендации
- Провести внешний аудит смарт-контрактов
- Использовать bug bounty
- Регулярно обновлять чек-лист
