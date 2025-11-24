# backend/app/config.py
from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Настройки приложения
    app_name: str = "ПЭН Система"
    debug: bool = False
    secret_key: str = "your-secret-key-change-in-production"
    
    # Настройки базы данных
    database_url: str = "postgresql://pen_user:your_secure_password@postgres:5432/pen_system"
    
    # Настройки LDAP/AD
    ldap_server: str = "ldap://your-ad-server.local"
    ldap_domain: str = "yourcompany.local"
    
    # Настройки Redis
    redis_url: str = "redis://redis:6379"
    
    # CORS настройки
    allowed_origins: list = [
        "http://localhost:3000",
        "http://frontend:3000", 
        "http://localhost:80",
        "http://127.0.0.1:3000"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Создаем экземпляр настроек
settings = Settings()