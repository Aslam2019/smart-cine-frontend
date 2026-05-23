import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sct_token')
    const savedUser = localStorage.getItem('sct_user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      // Verify with backend
      authAPI.me()
        .then(res => setUser(res.data.user))
        .catch(() => { localStorage.removeItem('sct_token'); localStorage.removeItem('sct_user') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    const { token, user } = res.data
    localStorage.setItem('sct_token', token)
    localStorage.setItem('sct_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const register = async (name, email, password, phone) => {
    const res = await authAPI.register({ name, email, password, phone })
    const { token, user } = res.data
    localStorage.setItem('sct_token', token)
    localStorage.setItem('sct_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('sct_token')
    localStorage.removeItem('sct_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
