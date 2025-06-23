// app/contexts/AuthContext.tsx
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || ''
const API_KEY = process.env.FUNCTION_KEY || ''

interface AuthProviderProps {
  children: ReactNode
}

// Backend response interfaces to match our Azure Functions
interface BackendLoginResponse {
  success: boolean
  message?: string
  user?: {
    id: string
    email: string
    name: string
    userType: string
  }
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
}

interface BackendRefreshResponse {
  success: boolean
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('auth_user')
      const savedAccessToken = localStorage.getItem('auth_access_token')
      const savedRefreshToken = localStorage.getItem('auth_refresh_token')
      
      if (savedUser && savedAccessToken && savedRefreshToken) {
        try {
          const parsedUser = JSON.parse(savedUser)
          
          // Validate the access token
          const isValid = await validateToken(savedAccessToken)
          
          if (isValid) {
            setUser({ ...parsedUser, token: savedAccessToken })
          } else {
            // Try to refresh the token
            const refreshSuccess = await refreshAccessToken(savedRefreshToken)
            if (!refreshSuccess) {
              // Refresh failed, clear everything
              clearAuthData()
            }
          }
        } catch (error) {
          console.error('Error parsing saved user:', error)
          clearAuthData()
        }
      }
      
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const clearAuthData = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_access_token')
    localStorage.removeItem('auth_refresh_token')
  }

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-functions-key': API_KEY,
        },
      })

      return response.ok
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  const refreshAccessToken = async (refreshToken: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-functions-key': API_KEY,
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        return false
      }

      const data: BackendRefreshResponse = await response.json()
      
      if (data.success && data.accessToken && data.refreshToken) {
        // Update stored tokens
        localStorage.setItem('auth_access_token', data.accessToken)
        localStorage.setItem('auth_refresh_token', data.refreshToken)
        
        // Update user object with new token
        const savedUser = localStorage.getItem('auth_user')
        if (savedUser && user) {
          const updatedUser = { ...user, token: data.accessToken }
          setUser(updatedUser)
        }
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-functions-key': API_KEY,
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        console.error('Login failed with status:', response.status)
        return false
      }

      const data: BackendLoginResponse = await response.json()
      
      if (data.success && data.user && data.accessToken && data.refreshToken) {
        const userWithToken: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          userType: data.user.userType as 'anonymous' | 'internal' | 'admin',
          token: data.accessToken
        }
        
        setUser(userWithToken)
        
        // Save to localStorage
        localStorage.setItem('auth_user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          userType: data.user.userType
        }))
        localStorage.setItem('auth_access_token', data.accessToken)
        localStorage.setItem('auth_refresh_token', data.refreshToken)
        
        return true
      } else {
        console.error('Login response missing required fields:', data)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('auth_refresh_token')
      
      if (refreshToken) {
        // Call logout endpoint to revoke refresh token
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-functions-key': API_KEY,
          },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuthData()
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user && user.userType !== 'anonymous'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}