# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

from .database import engine, get_db, Base
from . import models, schemas, calculations
from .auth import get_current_user, validate_ldap_user

# Создаем таблицы в БД
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ПЭН Система",
    description="Система управления планами и исполнениями поставок",
    version="1.0.0"
)

# Настройка CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "ПЭН Система управления поставками"}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "service": "pen-backend"}

# Эндпоинты для работы с заявками ПЭН
@app.get("/api/v1/orders", response_model=List[schemas.PenOrderResponse])
async def get_orders(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Получить список заявок ПЭН"""
    orders = db.query(models.PenOrder).offset(skip).limit(limit).all()
    return orders

@app.post("/api/v1/orders", response_model=schemas.PenOrderResponse)
async def create_order(
    order: schemas.PenOrderCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Создать новую заявку ПЭН"""
    
    # Автоматический расчет полей (как в Excel формулах)
    calculated_data = calculations.calculate_order_fields(order)
    
    db_order = models.PenOrder(
        **order.dict(),
        **calculated_data,
        created_by=current_user.get("username")
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.put("/api/v1/orders/{order_id}", response_model=schemas.PenOrderResponse)
async def update_order(
    order_id: int,
    order_update: schemas.PenOrderUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Обновить заявку ПЭН"""
    db_order = db.query(models.PenOrder).filter(models.PenOrder.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Проверка прав доступа в зависимости от роли
    user_role = current_user.get("role")
    calculations.validate_user_permissions(user_role, order_update)
    
    # Обновление полей с пересчетом формул
    for field, value in order_update.dict(exclude_unset=True).items():
        setattr(db_order, field, value)
    
    # Пересчет зависимых полей
    calculations.recalculate_order(db_order)
    
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/api/v1/reports/summary")
async def get_summary_report(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Отчет для руководства - аналоги SUBTOTAL формулам в Excel"""
    summary = calculations.generate_summary_report(db)
    return summary

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)