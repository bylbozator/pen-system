// frontend/src/services/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Создаем экземпляр axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Перехватчик для добавления авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API методы
export const authAPI = {
  login: async (username, password) => {
    const response = await api.get('/health', {
      auth: { username, password }
    })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/health')
    return response.data
  }
}

export const ordersAPI = {
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params })
    return response.data
  },

  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  updateOrder: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData)
    return response.data
  },

  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`)
    return response.data
  }
}

export const reportsAPI = {
  getSummary: async () => {
    const response = await api.get('/reports/summary')
    return response.data
  },

  exportToExcel: async () => {
    const response = await api.get('/reports/export/excel', {
      responseType: 'blob'
    })
    return response.data
  }
}

export default api