#!/bin/bash
# deploy-env.sh
# Копирует production env-файлы для деплоя
cp server/.env.production server/.env
cp client/.env.production client/.env
cd client && npm run build
