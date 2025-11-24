set -e

#!/bin/bash
# start.sh - Скрипт для запуска ПЭН системы

echo "🚀 Запуск ПЭН системы..."

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден. Создайте его из .env.example"
    exit 1
fi

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен"
    exit 1
fi

echo "📦 Сборка и запуск контейнеров..."
docker-compose up -d

echo "⏳ Ожидание запуска сервисов..."
sleep 10

# Проверка здоровья сервисов
echo "🔍 Проверка состояния сервисов..."

if curl -f http://localhost:8000/api/v1/health > /dev/null 2>&1; then
    echo "✅ Бэкенд запущен"
else
    echo "❌ Бэкенд не отвечает"
fi

if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Фронтенд запущен"
else
    echo "❌ Фронтенд не отвечает"
fi

echo ""
echo "🎉 ПЭН система запущена!"
echo "📊 Фронтенд: http://localhost"
echo "🔧 API: http://localhost:8000"
echo "📚 Документация: http://localhost:8000/docs"
echo ""
echo "Для остановки выполните: docker-compose down"