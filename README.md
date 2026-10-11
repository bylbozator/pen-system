<div align="center">

# ПЭН v1 — Система учёта и контроля поставок МТР

**Первая версия системы. Прототип, на базе которого построен [pen-system-02](https://github.com/bylbozator/pen-system-02).**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker%20Compose-ready-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)

Автоматизация планирования, согласования и контроля поставок
материально-технических ресурсов с разграничением прав между снабженцами
и экономистами.

</div>

---

## Возможности

- **План/факт по заявкам** – ввод плановых объёмов, стоимости и сроков потребности
  по каждой позиции МТР.
- **Корректировки и исполнение** – экономисты корректируют количество и стоимость,
  вносят данные спецификации и фактические поставки.
- **Авторасчёт отклонений** – разница между запланированным и фактическим
  количеством/стоимостью считается автоматически.
- **Ролевая модель** – три роли: снабженец, экономист, администратор.
- **Аутентификация** – поддержка **LDAP** (AD-домен) через переменные окружения,
  а также локальных учётных записей.
- **Отчётность** – визуализация планов/исполнения/отклонений в интерфейсе.

## Стек

| Компонент   | Технологии |
|-------------|------------|
| Бэкенд      | Python, FastAPI, SQLAlchemy, Alembic |
| База данных | PostgreSQL 15 (volumed + `init.sql`) |
| Кэш/сессии  | Redis 7 |
| Фронтенд    | React (Vite), чистые JSX-компоненты |
| Прокси      | Nginx (HTTP/HTTPS, reverse proxy) |
| Аутентификация | LDAP + local users |
| Инфраструктура | Docker Compose (+ `override`, `production`) |

## Модель данных (фрагмент)

`pen_orders` – центральная сущность:

- план: направление, № заявки, код/наименование материала, ЕИ, плановые
  количество/цена/стоимость, дата потребности;
- корректировки экономистом: итоговые количество/стоимость;
- исполнение: кол-во/цена/стоимость по спецификации;
- фактическая поставка: дата, количество, цена, стоимость (без НДС);
- авто-отклонения по количеству и стоимости; статусы, куратор, основание закупки.

Роли: `supplier` (снабженец) · `economist` (экономист) · `admin` (администратор).

## Быстрый старт

```bash
cp .env.example .env          # заполнить переменные Postgres/Redis/LDAP
chmod +x start.sh
./start.sh                    # docker compose up + миграции
```

Сервисы:

| Сервис    | Адрес |
|-----------|-------|
| Nginx     | http://localhost (443 для HTTPS) |
| Frontend  | http://localhost:3000 |
| Backend   | http://localhost:8000 (health: `/api/v1/health`) |
| Postgres  | 5432 |
| Redis     | 6379 |

При старте backend автоматически выполняет `alembic upgrade head`.

## Отличия от pen-system-02

Это первая, «черновая» версия системы: только одна сущность заявок, без
онлайн-редактора таблиц, импорта/экспорта Excel и мониторинга. Вторая версия
([pen-system-02](https://github.com/bylbozator/pen-system-02)) – полная
переработка: SQLAlchemy 2.0, Celery, Univer.js, TypeScript, аудит, Prometheus/Grafana.

## Структура

```
backend/
  app/                    — FastAPI: api, auth (LDAP), calculations, models, schemas
  alembic/                — версионирование схемы БД
frontend/
  src/components/         — LoginForm, Navigation, OrderForm, PenTable, Reports
  src/services/           — api, AuthContext
nginx/nginx.conf          — reverse proxy
postgres/init.sql         — инициализация БД
docker-compose*.yml       — dev / override / production
start.sh                  — запуск одним скриптом
```