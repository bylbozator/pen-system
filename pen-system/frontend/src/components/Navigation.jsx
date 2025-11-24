// frontend/src/components/Navigation.jsx
import React from 'react'
import { Menu, Button, Space, Tag } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { 
  TableOutlined, 
  BarChartOutlined, 
  UserOutlined,
  LogoutOutlined 
} from '@ant-design/icons'

const Navigation = ({ user, onLogout }) => {
  const location = useLocation()

  const menuItems = [
    {
      key: '/',
      icon: <TableOutlined />,
      label: <Link to="/">Заявки ПЭН</Link>,
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: <Link to="/reports">Отчеты</Link>,
    },
  ]

  const getRoleColor = (role) => {
    switch (role) {
      case 'supplier': return 'blue'
      case 'economist': return 'purple'
      case 'admin': return 'red'
      default: return 'default'
    }
  }

  const getRoleName = (role) => {
    switch (role) {
      case 'supplier': return 'Снабженец'
      case 'economist': return 'Экономист'
      case 'admin': return 'Администратор'
      default: return role
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ color: 'white', margin: 0, marginRight: '20px' }}>
          ПЭН Система
        </h1>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 200 }}
        />
      </div>
      
      <Space>
        <Tag color={getRoleColor(user?.role)} icon={<UserOutlined />}>
          {getRoleName(user?.role)}
        </Tag>
        <span style={{ color: 'white' }}>{user?.username}</span>
        <Button 
          type="primary" 
          danger 
          icon={<LogoutOutlined />}
          onClick={onLogout}
        >
          Выйти
        </Button>
      </Space>
    </div>
  )
}

export default Navigation