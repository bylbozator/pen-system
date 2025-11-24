-- postgres/init.sql
-- Инициализация базы данных ПЭН системы

-- Создание таблицы пользователей (если не используем только AD)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'supplier',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для пользователей
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Вставка тестовых пользователей (для разработки)
INSERT INTO users (username, email, full_name, role) VALUES
('supplier1', 'supplier1@company.ru', 'Иванов А.С.', 'supplier'),
('economist1', 'economist1@company.ru', 'Петрова Е.В.', 'economist'),
('admin1', 'admin1@company.ru', 'Сидоров П.К.', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Создание таблицы для логов действий
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для логов
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at в pen_orders
DROP TRIGGER IF EXISTS update_pen_orders_updated_at ON pen_orders;
CREATE TRIGGER update_pen_orders_updated_at
    BEFORE UPDATE ON pen_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Триггер для users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Комментарии к таблицам
COMMENT ON TABLE pen_orders IS 'Таблица заявок ПЭН (План-Исполнение-Норматив)';
COMMENT ON TABLE users IS 'Таблица пользователей системы';
COMMENT ON TABLE audit_logs IS 'Таблица логов действий пользователей';