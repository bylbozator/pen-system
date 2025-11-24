// frontend/src/components/Reports.jsx
import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Button, 
  DatePicker,
  Select,
  Space,
  message,
  Alert
} from 'antd'
import { 
  DownloadOutlined, 
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined 
} from '@ant-design/icons'
import { reportsAPI, ordersAPI } from '../services/api'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select

const Reports = () => {
  const [summary, setSummary] = useState({})
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')])
  const [statusFilter, setStatusFilter] = useState('all')

  const loadReportData = async () => {
    setLoading(true)
    try {
      const [summaryData, ordersData] = await Promise.all([
        reportsAPI.getSummary(),
        ordersAPI.getOrders()
      ])
      setSummary(summaryData)
      setOrders(ordersData)
    } catch (error) {
      message.error('Ошибка загрузки отчетов')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportData()
  }, [])

  const handleExportExcel = async () => {
    try {
      const blob = await reportsAPI.exportToExcel()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `pen_report_${dayjs().format('YYYY-MM-DD')}.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      message.success('Отчет успешно экспортирован')
    } catch (error) {
      message.error('Ошибка экспорта отчета')
    }
  }

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const orderDate = dayjs(order.need_date)
      return orderDate >= dateRange[0] && orderDate <= dateRange[1]
    }
    
    return true
  })

  const summaryColumns = [
    {
      title: 'Показатель',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'План',
      dataIndex: 'planned',
      key: 'planned',
      width: 120,
      render: (value) => value?.toLocaleString('ru-RU', { minimumFractionDigits: 2 }),
    },
    {
      title: 'Факт',
      dataIndex: 'actual',
      key: 'actual',
      width: 120,
      render: (value) => value?.toLocaleString('ru-RU', { minimumFractionDigits: 2 }),
    },
    {
      title: 'Отклонение',
      dataIndex: 'deviation',
      key: 'deviation',
      width: 120,
      render: (value, record) => {
        const deviation = record.actual - record.planned
        const percent = record.planned ? (deviation / record.planned * 100) : 0
        
        return (
          <span style={{ color: deviation >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {deviation.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} 
            {' '}({percent.toFixed(1)}%)
          </span>
        )
      },
    },
  ]

  const summaryData = [
    {
      key: '1',
      name: 'Количество, ед.',
      planned: summary.total_planned_quantity || 0,
      actual: summary.total_final_quantity || 0,
    },
    {
      key: '2',
      name: 'Плановая стоимость, руб.',
      planned: summary.total_planned_cost || 0,
      actual: summary.total_final_cost || 0,
    },
    {
      key: '3',
      name: 'Стоимость по спецификациям, руб.',
      planned: summary.total_final_cost || 0,
      actual: summary.total_specification_cost || 0,
    },
    {
      key: '4',
      name: 'Фактическая стоимость, руб.',
      planned: summary.total_specification_cost || 0,
      actual: summary.total_actual_cost || 0,
    },
  ]

  const deviationColumns = [
    {
      title: '№ заявки',
      dataIndex: 'request_number',
      key: 'request_number',
      width: 120,
    },
    {
      title: 'Материал',
      dataIndex: 'material_name',
      key: 'material_name',
      ellipsis: true,
    },
    {
      title: 'План. кол-во',
      dataIndex: 'planned_quantity',
      key: 'planned_quantity',
      width: 100,
      render: (value) => value?.toLocaleString('ru-RU'),
    },
    {
      title: 'Факт. кол-во',
      dataIndex: 'actual_quantity',
      key: 'actual_quantity',
      width: 100,
      render: (value) => value?.toLocaleString('ru-RU'),
    },
    {
      title: 'Отклонение кол-ва',
      dataIndex: 'quantity_deviation',
      key: 'quantity_deviation',
      width: 120,
      render: (value) => (
        <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {value?.toLocaleString('ru-RU')}
        </span>
      ),
    },
    {
      title: 'План. стоимость',
      dataIndex: 'planned_cost',
      key: 'planned_cost',
      width: 120,
      render: (value) => value?.toLocaleString('ru-RU'),
    },
    {
      title: 'Факт. стоимость',
      dataIndex: 'actual_cost',
      key: 'actual_cost',
      width: 120,
      render: (value) => value?.toLocaleString('ru-RU'),
    },
    {
      title: 'Отклонение стоимости',
      dataIndex: 'cost_deviation',
      key: 'cost_deviation',
      width: 140,
      render: (value) => (
        <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {value?.toLocaleString('ru-RU')}
        </span>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <span style={{ 
          color: status?.includes('поставлено') ? '#52c41a' : 
                 status?.includes('оформлен') ? '#1890ff' : '#faad14'
        }}>
          {status || 'Новый'}
        </span>
      ),
    },
  ]

  const deviationsData = filteredOrders
    .filter(order => order.quantity_deviation !== 0 || order.cost_deviation !== 0)
    .sort((a, b) => Math.abs(b.cost_deviation) - Math.abs(a.cost_deviation))

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
          >
            Экспорт в Excel
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadReportData}
          >
            Обновить
          </Button>
          
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="DD.MM.YYYY"
          />
          
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 200 }}
          >
            <Option value="all">Все статусы</Option>
            <Option value="поставлено">Поставлено</Option>
            <Option value="оформлен">Оформлено</Option>
            <Option value="ожидание">В ожидании</Option>
          </Select>
        </Space>
      </div>

      {/* Статистика */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Общая плановая стоимость"
              value={summary.total_planned_cost || 0}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix="₽"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Стоимость по спецификациям"
              value={summary.total_specification_cost || 0}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
              prefix="₽"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Фактическая стоимость"
              value={summary.total_actual_cost || 0}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix="₽"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Общее отклонение"
              value={summary.total_cost_deviation || 0}
              precision={2}
              valueStyle={{ 
                color: (summary.total_cost_deviation || 0) >= 0 ? '#52c41a' : '#ff4d4f' 
              }}
              prefix={(summary.total_cost_deviation || 0) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="₽"
            />
          </Card>
        </Col>
      </Row>

      {/* Сводная таблица */}
      <Card title="Сводный отчет по показателям" style={{ marginBottom: 24 }}>
        <Table
          columns={summaryColumns}
          dataSource={summaryData}
          pagination={false}
          size="middle"
        />
      </Card>

      {/* Отклонения */}
      <Card 
        title={`Отклонения по заявкам (${deviationsData.length})`}
        extra={
          <Alert 
            message="Отображаются только заявки с отклонениями" 
            type="info" 
            showIcon 
          />
        }
      >
        <Table
          columns={deviationColumns}
          dataSource={deviationsData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>
    </div>
  )
}

export default Reports