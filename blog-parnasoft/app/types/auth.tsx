// app/types/auth.tsx
export interface User {
  id: string
  email: string
  name: string
  userType: 'anonymous' | 'internal' | 'admin' | 'super_admin'
  token?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message?: string
  user?: User
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

