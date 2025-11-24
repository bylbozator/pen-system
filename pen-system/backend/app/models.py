# backend/app/models.py
from sqlalchemy import Column, Integer, String, Numeric, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    SUPPLIER = "supplier"      # Снабженец
    ECONOMIST = "economist"    # Экономист
    ADMIN = "admin"            # Администратор

class PenOrder(Base):
    __tablename__ = "pen_orders"
    
    # Основные поля (заполняются снабженцами - голубые/зеленые)
    id = Column(Integer, primary_key=True, index=True)
    direction = Column(String(50))                    # Направление использования
    request_number = Column(String(20))              # № заявки
    material_code = Column(String(20))               # Материал код
    material_name = Column(Text)                     # Наименование материала
    unit = Column(String(10))                        # ЕИ
    planned_quantity = Column(Numeric(15, 2))        # Кол-во (J)
    planned_price = Column(Numeric(15, 2))           # Цена (K)
    planned_cost = Column(Numeric(15, 2))            # Стоимость (L)
    need_date = Column(DateTime)                     # Дата потребности
    
    # Корректировки (заполняются экономистами - лиловые)
    corrected_quantity = Column(Numeric(15, 2))      # Кол-во корр. (O)
    final_quantity = Column(Numeric(15, 2))          # Кол-во с учетом корр. (P)
    final_cost = Column(Numeric(15, 2))              # Стоимость с учетом корр. (Q)
    
    # Исполнение (заполняются экономистами - желтые)
    specification_quantity = Column(Numeric(15, 2))  # Кол-во по потребности в спецификации (W)
    specification_price = Column(Numeric(15, 2))     # Цена, руб., без НДС (X)
    specification_cost = Column(Numeric(15, 2))      # Стоимость, руб., без НДС (Y)
    
    # Фактическая поставка (экономисты)
    actual_delivery_date = Column(DateTime)          # дата поставки
    actual_quantity = Column(Numeric(15, 2))         # количество (AI)
    actual_price = Column(Numeric(15, 2))            # цена, без НДС (AJ)
    actual_cost = Column(Numeric(15, 2))             # стоимость, без НДС (AK)
    
    # Статусы и метаданные
    status = Column(String(100))                     # Статус поставки
    curator = Column(String(100))                    # Куратор УМТСиК
    purchase_basis = Column(String(100))             # Основание закупки
    
    # Отклонения (автоматический расчет)
    quantity_deviation = Column(Numeric(15, 2))      # количество (AQ)
    cost_deviation = Column(Numeric(15, 2))          # стоимость, без НДС (AR)
    
    # Системные поля
    created_by = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<PenOrder {self.request_number} - {self.material_name}>"