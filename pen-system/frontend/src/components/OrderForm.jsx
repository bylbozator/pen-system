// frontend/src/components/OrderForm.jsx
import React from 'react'
import { Form, Input, InputNumber, DatePicker, Button, Space, Row, Col } from 'antd'
import { useAuth } from '../services/AuthContext'
import dayjs from 'dayjs'

const OrderForm = ({ order, onSubmit, onCancel, userRole }) => {
  const [form] = Form.useForm()
  const { user } = useAuth()

  React.useEffect(() => {
    if (order) {
      form.setFieldsValue({
        ...order,
        need_date: order.need_date ? dayjs(order.need_date) : null,
        actual_delivery_date: order.actual_delivery_date ? dayjs(order.actual_delivery_date) : null,
      })
    }
  }, [order, form])

  const handleSubmit = async (values) => {
    await onSubmit({
      ...values,
      need_date: values.need_date?.toISOString(),
      actual_delivery_date: values.actual_delivery_date?.toISOString(),
    })
  }

  const isFieldDisabled = (fieldType) => {
    if (!userRole) return true
    
    if (userRole === 'supplier') {
      return fieldType === 'economist'
    }
    
    if (userRole === 'economist') {
      return fieldType === 'supplier'
    }
    
    return false
  }

  const getFieldClassName = (fieldType) => {
    switch (fieldType) {
      case 'supplier': return 'supplier-field'
      case 'economist': return 'economist-field-purple'
      case 'calculated': return 'calculated-field'
      default: return ''
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        unit: 'КГ',
        direction: 'ПЭН-1'
      }}
    >
      <Row gutter={16}>
        {/* Поля снабженцев */}
        <Col span={12}>
          <Form.Item
            name="direction"
            label="Направление использования"
            className={getFieldClassName('supplier')}
          >
            <Input disabled={isFieldDisabled('supplier')} />
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item
            name="request_number"
            label="№ заявки"
            rules={[{ required: true, message: 'Введите номер заявки' }]}
            className={getFieldClassName('supplier')}
          >
            <Input disabled={isFieldDisabled('supplier')} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="material_code"
            label="Код материала"
            rules={[{ required: true, message: 'Введите код материала' }]}
            className={getFieldClassName('supplier')}
          >
            <Input disabled={isFieldDisabled('supplier')} />
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item
            name="unit"
            label="Единица измерения"
            className={getFieldClassName('supplier')}
          >
            <Input disabled={isFieldDisabled('supplier')} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="material_name"
        label="Наименование материала"
        rules={[{ required: true, message: 'Введите наименование' }]}
        className={getFieldClassName('supplier')}
      >
        <Input.TextArea 
          rows={2} 
          disabled={isFieldDisabled('supplier')}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="planned_quantity"
            label="Плановое количество"
            rules={[{ required: true, message: 'Введите количество' }]}
            className={getFieldClassName('supplier')}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              disabled={isFieldDisabled('supplier')}
            />
          </Form.Item>
        </Col>
        
        <Col span={8}>
          <Form.Item
            name="planned_price"
            label="Плановая цена"
            rules={[{ required: true, message: 'Введите цену' }]}
            className={getFieldClassName('supplier')}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              disabled={isFieldDisabled('supplier')}
            />
          </Form.Item>
        </Col>
        
        <Col span={8}>
          <Form.Item
            name="need_date"
            label="Дата потребности"
            className={getFieldClassName('supplier')}
          >
            <DatePicker
              style={{ width: '100%' }}
              disabled={isFieldDisabled('supplier')}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Поля экономистов */}
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="corrected_quantity"
            label="Корректировка количества"
            className={getFieldClassName('economist')}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              disabled={isFieldDisabled('economist')}
            />
          </Form.Item>
        </Col>
        
        <Col span={8}>
          <Form.Item
            name="specification_quantity"
            label="Кол-во по спецификации"
            className={getFieldClassName('economist')}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              disabled={isFieldDisabled('economist')}
            />
          </Form.Item>
        </Col>
        
        <Col span={8}>
          <Form.Item
            name="specification_price"
            label="Цена по спецификации"
            className={getFieldClassName('economist')}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              disabled={isFieldDisabled('economist')}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            name="actual_quantity"
            label="Фактическое количество"
            className={getFieldClassName('economist')}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              disabled={isFieldDisabled('economist')}
            />
          </Form.Item>
        </Col>
        
        <Col span={8}>
          <Form.Item
            name="actual_price"
            label="Фактическая цена"
            className={getFieldClassName('economist')}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              disabled={isFieldDisabled('economist')}
            />
          </Form.Item>
        </Col>
        
        <Col span={8}>
          <Form.Item
            name="actual_delivery_date"
            label="Дата фактической поставки"
            className={getFieldClassName('economist')}
          >
            <DatePicker
              style={{ width: '100%' }}
              disabled={isFieldDisabled('economist')}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="status"
        label="Статус поставки"
        className={getFieldClassName('economist')}
      >
        <Input disabled={isFieldDisabled('economist')} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {order ? 'Обновить' : 'Создать'}
          </Button>
          <Button onClick={onCancel}>
            Отмена
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default OrderForm