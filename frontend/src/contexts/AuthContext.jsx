import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      const decoded = jwtDecode(savedToken)
      setCurrentUser(decoded)
    }
    setIsLoading(false)
  }, [])

  const login = (newToken) => {
    sessionStorage.setItem('token', newToken)
    setToken(newToken)
    const decoded = jwtDecode(newToken)
    setCurrentUser(decoded)
    navigate('/admin')
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    setToken(null)
    setCurrentUser(null)
    navigate('/')
  }

  const isLoggedIn = !!token

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, isLoading, login, logout, currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}