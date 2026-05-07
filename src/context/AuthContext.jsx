/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem('authToken')
  const savedUser = localStorage.getItem('userData')
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token && savedUser))
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null)

  const login = (userData, token) => {
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify(userData))
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  }

  const value = {
    isAuthenticated,
    user,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
