#!/bin/bash
# backend/init.sh

echo "🔄 Применение миграций базы данных..."
alembic upgrade head

echo "🚀 Запуск приложения..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload