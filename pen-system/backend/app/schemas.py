# backend/app/schemas.py
from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
import enum

class UserRole(str, enum.Enum):
    SUPPLIER = "supplier"      # Снабженец
    ECONOMIST = "economist"    # Экономист
    ADMIN = "admin"            # Администратор

# Базовые схемы
class PenOrderBase(BaseModel):
    direction: str                                    # Направление использования
    request_number: str                               # № заявки
    material_code: str                                # Материал код
    material_name: str                                # Наименование материала
    unit: str                                         # ЕИ
    planned_quantity: Decimal                         # Кол-во (J)
    planned_price: Decimal                            # Цена (K)
    need_date: datetime                               # Дата потребности
    
    # Поля снабженцев (голубые/зеленые)
    specification_name: Optional[str] = None         # Наименование в спецификации
    technical_spec: Optional[str] = None             # Техническая характеристика
    delivery_method: Optional[str] = None            # Способ поставки
    curator: Optional[str] = None                    # Куратор УМТСиК
    purchase_basis: Optional[str] = None             # Основание закупки

    class Config:
        from_attributes = True

# Схема для создания (снабженцы)
class PenOrderCreate(PenOrderBase):
    pass

# Схема для обновления (разделение по ролям)
class PenOrderUpdate(BaseModel):
    # Поля экономистов (лиловые/желтые)
    corrected_quantity: Optional[Decimal] = None     # Кол-во корр. (O)
    specification_quantity: Optional[Decimal] = None # Кол-во по спецификации (W)
    specification_price: Optional[Decimal] = None    # Цена спецификации (X)
    actual_delivery_date: Optional[datetime] = None  # Дата поставки
    actual_quantity: Optional[Decimal] = None        # Фактическое кол-во (AI)
    actual_price: Optional[Decimal] = None           # Фактическая цена (AJ)
    status: Optional[str] = None                     # Статус поставки

    # Поля снабженцев
    specification_name: Optional[str] = None
    technical_spec: Optional[str] = None
    delivery_method: Optional[str] = None

    @validator('corrected_quantity')
    def validate_correction(cls, v):
        if v is not None and v < 0:
            raise ValueError('Корректировка не может быть отрицательной')
        return v

# Полная схема ответа
class PenOrderResponse(PenOrderBase):
    id: int
    # Расчетные поля (автоматические)
    planned_cost: Decimal                            # Стоимость (L) = J*K
    final_quantity: Decimal                          # Кол-во с учетом корр. (P) = J+O
    final_cost: Decimal                              # Стоимость с учетом корр. (Q) = P*K
    specification_cost: Decimal                      # Стоимость спецификации (Y) = W*X*1.02
    actual_cost: Decimal                             # Фактическая стоимость (AK) = AI*AJ
    quantity_deviation: Decimal                      # Отклонение кол-ва (AQ) = W-P
    cost_deviation: Decimal                          # Отклонение стоимости (AR) = Y-Q
    
    # Статусные поля
    status: Optional[str] = None
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Схема для отчетов
class SummaryReport(BaseModel):
    total_planned_quantity: Decimal                  # =SUBTOTAL(9,J4:J59899)
    total_planned_cost: Decimal                      # =SUBTOTAL(9,L4:L59899)
    total_final_quantity: Decimal                    # =SUBTOTAL(9,P4:P59899)
    total_final_cost: Decimal                        # =SUBTOTAL(9,Q4:Q59899)
    total_specification_cost: Decimal                # =SUBTOTAL(9,Y4:Y59902)
    total_actual_cost: Decimal                       # =SUBTOTAL(9,AI4:AI59828)
    total_quantity_deviation: Decimal
    total_cost_deviation: Decimal

# Схема пользователя
class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: UserRole
    disabled: Optional[bool] = None

class Token(BaseModel):
    access_token: str
    token_type: str