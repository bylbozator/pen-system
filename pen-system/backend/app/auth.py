# backend/app/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import ldap
import os
from . import schemas
import logging

logger = logging.getLogger(__name__)
security = HTTPBearer()

# Конфигурация LDAP/AD
LDAP_SERVER = os.getenv("LDAP_SERVER", "ldap://your-ad-server.local")
LDAP_DOMAIN = os.getenv("LDAP_DOMAIN", "yourcompany.local")

def validate_ldap_user(username: str, password: str) -> dict:
    """Проверка пользователя через Active Directory"""
    
    try:
        # Формируем DN пользователя
        user_dn = f"cn={username},ou=users,dc=yourcompany,dc=local"
        
        # Подключаемся к AD
        conn = ldap.initialize(LDAP_SERVER)
        conn.set_option(ldap.OPT_REFERRALS, 0)
        
        # Пытаемся привязаться с учетными данными пользователя
        conn.simple_bind_s(user_dn, password)
        
        # Если успешно - получаем информацию о пользователе
        search_filter = f"(sAMAccountName={username})"
        attributes = ['cn', 'mail', 'memberOf']
        result = conn.search_s(user_dn, ldap.SCOPE_SUBTREE, search_filter, attributes)
        
        conn.unbind()
        
        if result:
            # Определяем роль на основе групп AD
            user_groups = result[0][1].get('memberOf', [])
            role = determine_user_role(user_groups)
            
            return {
                "username": username,
                "email": result[0][1].get('mail', [b''])[0].decode(),
                "full_name": result[0][1].get('cn', [b''])[0].decode(),
                "role": role,
                "disabled": False
            }
        
    except ldap.INVALID_CREDENTIALS:
        logger.warning(f"Invalid credentials for user {username}")
        return None
    except Exception as e:
        logger.error(f"LDAP error: {e}")
        return None
    
    return None

def determine_user_role(ldap_groups: list) -> schemas.UserRole:
    """Определение роли пользователя на основе групп AD"""
    
    groups_str = [group.decode('utf-8').lower() for group in ldap_groups]
    
    if any('economist' in group for group in groups_str):
        return schemas.UserRole.ECONOMIST
    elif any('supplier' in group or 'snab' in group for group in groups_str):
        return schemas.UserRole.SUPPLIER
    elif any('admin' in group for group in groups_str):
        return schemas.UserRole.ADMIN
    else:
        return schemas.UserRole.SUPPLIER  # По умолчанию

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Получение текущего пользователя из токена"""
    
    # В реальной реализации здесь была бы JWT валидация
    # Для упрощения используем базовую аутентификацию
    
    from fastapi.security import HTTPBasic, HTTPBasicCredentials
    import secrets
    
    security_basic = HTTPBasic()
    
    try:
        credentials_basic: HTTPBasicCredentials = await security_basic(credentials)
        
        user_info = validate_ldap_user(
            credentials_basic.username, 
            credentials_basic.password
        )
        
        if user_info is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Basic"},
            )
        
        return user_info
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Basic"},
        )