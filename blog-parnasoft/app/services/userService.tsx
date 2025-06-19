// services/userService.ts - Fixed version
import { User, CreateUserRequest, UpdateUserRequest, UserType } from '../types/user'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const API_KEY = process.env.NEXT_PUBLIC_FUNCTION_KEY || ''

class UserService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    // Properly type headers as Record<string, string>
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-functions-key': API_KEY,
    }

    // Add any additional headers from options
    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    // Get auth token if available (only in browser environment)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorData}`)
    }

    // Handle empty responses
    if (response.status === 204) {
      return null as T
    }

    return response.json()
  }

  async listUsers(): Promise<User[]> {
    try {
      const response = await this.makeRequest<{
        success: boolean
        users: Array<{
          Id: string
          Email: string
          Name: string
          UserType: UserType
          IsActive?: boolean
          CreatedAt?: string
          UpdatedAt?: string
          LastLoginAt?: string
        }>
      }>('/user-management/list')
      
      // Map the API response to match our User interface
      const users = response?.users?.map(user => ({
        id: user.Id,
        email: user.Email,
        name: user.Name,
        userType: user.UserType,
        isActive: user.IsActive ?? true, // Default to true if not provided
        createdAt: user.CreatedAt,
        updatedAt: user.UpdatedAt,
        lastLoginAt: user.LastLoginAt
      })) || []
      
      return users
    } catch (error) {
      console.error('Error listing users:', error)
      throw new Error('Failed to fetch users')
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await this.makeRequest<{
        success: boolean
        user: {
          Id: string
          Email: string
          Name: string
          UserType: UserType
          IsActive?: boolean
          CreatedAt?: string
          UpdatedAt?: string
          LastLoginAt?: string
        }
      }>('/user-management/create', {
        method: 'POST',
        body: JSON.stringify(userData),
      })
      
      // Map the API response to match our User interface
      const user = response.user
      return {
        id: user.Id,
        email: user.Email,
        name: user.Name,
        userType: user.UserType,
        isActive: user.IsActive ?? true,
        createdAt: user.CreatedAt,
        updatedAt: user.UpdatedAt,
        lastLoginAt: user.LastLoginAt
      }
    } catch (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user')
    }
  }

  async updateUser(userData: UpdateUserRequest): Promise<User> {
    try {
      return await this.makeRequest<User>(`/user-management/update/${userData.id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      })
    } catch (error) {
      console.error('Error updating user:', error)
      throw new Error('Failed to update user')
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.makeRequest<void>(`/user-management/delete/${userId}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new Error('Failed to delete user')
    }
  }

  async resetPassword(userId: string): Promise<void> {
    try {
      await this.makeRequest<void>(`/user-management/reset-password/${userId}`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error resetting password:', error)
      throw new Error('Failed to reset password')
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      return await this.makeRequest<User>(`/user-management/user/${userId}`)
    } catch (error) {
      console.error('Error fetching user:', error)
      throw new Error('Failed to fetch user')
    }
  }

  async changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.makeRequest<void>(`/user-management/change-password/${userId}`, {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })
    } catch (error) {
      console.error('Error changing password:', error)
      throw new Error('Failed to change password')
    }
  }

  async bulkUpdateUsers(userIds: string[], updates: Partial<User>): Promise<User[]> {
    try {
      return await this.makeRequest<User[]>('/user-management/bulk-update', {
        method: 'POST',
        body: JSON.stringify({
          userIds,
          updates,
        }),
      })
    } catch (error) {
      console.error('Error bulk updating users:', error)
      throw new Error('Failed to bulk update users')
    }
  }

  async getUserStats(): Promise<{
    total: number
    active: number
    inactive: number
    byType: Record<string, number>
    recentLogins: number
  }> {
    try {
      return await this.makeRequest<any>('/user-management/stats')
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw new Error('Failed to fetch user statistics')
    }
  }
}

export const userService = new UserService()