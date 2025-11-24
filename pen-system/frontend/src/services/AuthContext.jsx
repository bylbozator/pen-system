// frontend/src/services/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react'
import { authAPI } from './api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = async (username, password) => {
    setLoading(true)
    try {
      // Используем Basic Auth через заголовки
      const token = btoa(`${username}:${password}`)
      localStorage.setItem('auth_token', token)
      
      const userData = await authAPI.getCurrentUser()
      setUser(userData)
      return { success: true }
    } catch (error) {
      localStorage.removeItem('auth_token')
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Ошибка авторизации' 
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    setUser,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}