// frontend/src/components/PenTable.jsx
import React, { useState, useEffect } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  message, 
  Modal
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  ReloadOutlined
} from '@ant-design/icons'
import { useAuth } from '../services/AuthContext'
import { ordersAPI } from '../services/api'
import OrderForm from './OrderForm'

const PenTable = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await ordersAPI.getOrders()
      setOrders(data)
    } catch (error) {
      message.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleCreate = () => {
    setEditingOrder(null)
    setModalVisible(true)
  }

  const handleEdit = (order) => {
    setEditingOrder(order)
    setModalVisible(true)
  }

  const handleSubmit = async (values) => {
    try {
      if (editingOrder) {
        await ordersAPI.updateOrder(editingOrder.id, values)
        message.success('Заявка обновлена')
      } else {
        await ordersAPI.createOrder(values)
        message.success('Заявка создана')
      }
      setModalVisible(false)
      loadOrders()
    } catch (error) {
      message.error('Ошибка сохранения')
    }
  }

  const getFieldClassName = (fieldType) => {
    switch (fieldType) {
      case 'supplier': return 'supplier-field'
      case 'supplier-green': return 'supplier-field-green'
      case 'economist-purple': return 'economist-field-purple'
      case 'economist-yellow': return 'economist-field-yellow'
      case 'calculated': return 'calculated-field'
      default: return ''
    }
  }

  const getStatusColor = (status) => {
    if (!status) return 'default'
    
    if (status.includes('поставлено')) return 'green'
    if (status.includes('оформлен')) return 'blue'
    if (status.includes('ожидание')) return 'orange'
    return 'default'
  }

  const columns = [
    {
      title: '№ заявки',
      dataIndex: 'request_number',
      key: 'request_number',
      width: 120,
      className: getFieldClassName('supplier'),
    },
    {
      title: 'Направление',
      dataIndex: 'direction',
      key: 'direction',
      width: 100,
      className: getFieldClassName('supplier'),
    },
    {
      title: 'Материал',
      dataIndex: 'material_name',
      key: 'material_name',
      ellipsis: true,
      className: getFieldClassName('supplier'),
    },
    {
      title: 'План. кол-во',
      dataIndex: 'planned_quantity',
      key: 'planned_quantity',
      width: 100,
      render: (value) => value?.toLocaleString('ru-RU'),
      className: getFieldClassName('supplier'),
    },
    {
      title: 'Цена',
      dataIndex: 'planned_price',
      key: 'planned_price',
      width: 100,
      render: (value) => value?.toLocaleString('ru-RU'),
      className: getFieldClassName('supplier-green'),
    },
    {
      title: 'Стоимость',
      dataIndex: 'planned_cost',
      key: 'planned_cost',
      width: 120,
      render: (value) => value?.toLocaleString('ru-RU'),
      className: getFieldClassName('calculated'),
    },
    {
      title: 'Корр. кол-во',
      dataIndex: 'corrected_quantity',
      key: 'corrected_quantity',
      width: 100,
      render: (value) => value?.toLocaleString('ru-RU'),
      className: getFieldClassName('economist-purple'),
    },
    {
      title: 'Итог. кол-во',
      dataIndex: 'final_quantity',
      key: 'final_quantity',
      width: 100,
      render: (value) => value?.toLocaleString('ru-RU'),
      className: getFieldClassName('calculated'),
    },
    {
      title: 'Итог. стоимость',
      dataIndex: 'final_cost',
      key: 'final_cost',
      width: 120,
      render: (value) => value?.toLocaleString('ru-RU'),
      className: getFieldClassName('calculated'),
    },
    {
      title: 'Факт. поставка',
      dataIndex: 'actual_quantity',
      key: 'actual_quantity',
      width: 100,
      render: (value) => value?.toLocaleString('ru-RU'),
      className: getFieldClassName('economist-yellow'),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status || 'Новый'}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          Редакт.
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            disabled={user?.role === 'economist'}
          >
            Новая заявка
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadOrders}
          >
            Обновить
          </Button>
          
          <Tag color="blue">Снабжение</Tag>
          <Tag color="green">Снабжение (доп.)</Tag>
          <Tag color="purple">Экономисты</Tag>
          <Tag color="yellow">Экономисты (факт)</Tag>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1300 }}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total, range) => 
            `Записи ${range[0]}-${range[1]} из ${total}`
        }}
      />

      <Modal
        title={editingOrder ? 'Редактирование заявки' : 'Новая заявка'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <OrderForm
          order={editingOrder}
          onSubmit={handleSubmit}
          onCancel={() => setModalVisible(false)}
          userRole={user?.role}
        />
      </Modal>
    </div>
  )
}

export default PenTable