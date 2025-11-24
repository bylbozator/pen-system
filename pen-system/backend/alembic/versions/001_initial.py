# backend/alembic/versions/001_initial.py
"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2024-01-01 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Создание таблицы pen_orders
    op.create_table('pen_orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('direction', sa.String(length=50), nullable=True),
        sa.Column('request_number', sa.String(length=20), nullable=True),
        sa.Column('material_code', sa.String(length=20), nullable=True),
        sa.Column('material_name', sa.Text(), nullable=True),
        sa.Column('unit', sa.String(length=10), nullable=True),
        sa.Column('planned_quantity', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('planned_price', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('planned_cost', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('need_date', sa.DateTime(), nullable=True),
        sa.Column('corrected_quantity', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('final_quantity', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('final_cost', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('specification_quantity', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('specification_price', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('specification_cost', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('actual_delivery_date', sa.DateTime(), nullable=True),
        sa.Column('actual_quantity', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('actual_price', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('actual_cost', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('status', sa.String(length=100), nullable=True),
        sa.Column('curator', sa.String(length=100), nullable=True),
        sa.Column('purchase_basis', sa.String(length=100), nullable=True),
        sa.Column('quantity_deviation', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('cost_deviation', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('created_by', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Создание индексов для производительности
    op.create_index(op.f('ix_pen_orders_id'), 'pen_orders', ['id'], unique=False)
    op.create_index(op.f('ix_pen_orders_request_number'), 'pen_orders', ['request_number'], unique=False)
    op.create_index(op.f('ix_pen_orders_need_date'), 'pen_orders', ['need_date'], unique=False)
    op.create_index(op.f('ix_pen_orders_status'), 'pen_orders', ['status'], unique=False)

def downgrade() -> None:
    # Удаление индексов
    op.drop_index(op.f('ix_pen_orders_status'), table_name='pen_orders')
    op.drop_index(op.f('ix_pen_orders_need_date'), table_name='pen_orders')
    op.drop_index(op.f('ix_pen_orders_request_number'), table_name='pen_orders')
    op.drop_index(op.f('ix_pen_orders_id'), table_name='pen_orders')
    
    # Удаление таблицы
    op.drop_table('pen_orders')