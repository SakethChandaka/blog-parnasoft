// types/user.tsx
export type UserType = 'super_admin' | 'admin' | 'internal' | 'anonymous'

export interface User {
  id: string
  email: string
  name: string
  userType: UserType
  isActive: boolean
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string
  profilePicture?: string
  phoneNumber?: string
  department?: string
  role?: string
  permissions?: string[]
  metadata?: Record<string, any>
}

export interface CreateUserRequest {
  email: string
  password: string
  name: string
  userType: UserType
  isActive?: boolean
  phoneNumber?: string
  department?: string
  role?: string
  permissions?: string[]
}

export interface UpdateUserRequest {
  id: string
  email?: string
  name?: string
  userType?: UserType
  isActive?: boolean
  phoneNumber?: string
  department?: string
  role?: string
  permissions?: string[]
  password?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresIn: number
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface ResetPasswordResponse {
  message: string
}

export interface ValidateTokenResponse {
  user: User
  valid: boolean
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  byType: Record<UserType, number>
  recentLogins: number
  newUsersThisMonth: number
  lastMonthGrowth: number
}

export interface UserSession {
  id: string
  userId: string
  token: string
  refreshToken: string
  createdAt: string
  expiresAt: string
  isActive: boolean
  ipAddress?: string
  userAgent?: string
  lastActivity: string
}

export interface UserActivity {
  id: string
  userId: string
  action: string
  resource?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: string
}

// Utility types for user management
export interface UserFilters {
  userType?: UserType | 'all'
  isActive?: boolean
  searchTerm?: string
  department?: string
  role?: string
  createdAfter?: string
  createdBefore?: string
  lastLoginAfter?: string
  lastLoginBefore?: string
}

export interface UserSortOptions {
  field: keyof User
  direction: 'asc' | 'desc'
}

export interface PaginatedUsers {
  users: User[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface BulkUserOperation {
  userIds: string[]
  operation: 'activate' | 'deactivate' | 'delete' | 'updateType' | 'updateRole'
  value?: any
}

// Permission system types
export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystemRole: boolean
}

export interface UserPermissionCheck {
  userId: string
  resource: string
  action: string
  hasPermission: boolean
}

// User preference types
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  marketingEmails: boolean
}

export interface UserProfile extends User {
  preferences: UserPreferences
  sessions: UserSession[]
  recentActivity: UserActivity[]
}