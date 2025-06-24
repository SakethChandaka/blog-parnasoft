// app/services/blogService.ts
import { BlogPost, UserType, AuthorType, Visibility } from '../types/blog'

// API response error handling
class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'APIError'
  }
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text()
    throw new APIError(errorText || `HTTP ${response.status}`, response.status)
  }
  
  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

// Remove this entire section:
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
// const API_KEY = process.env.NEXT_PUBLIC_FUNCTION_KEY || ''

// Replace makeRequest function with:
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `/api${endpoint}` // Now calls your Next.js API routes
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new APIError(errorText || `HTTP ${response.status}`, response.status)
    }
    
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return response.json()
    }
    return response.text()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const blogService = {
  // Get featured posts based on user access level
  getFeaturedPosts: async (userType: UserType): Promise<BlogPost[]> => {
    try {
      const queryParam = userType !== 'anonymous' ? `?userType=${userType}` : ''
      const result = await apiCall(`/posts${queryParam}`)
      
      // Handle different response formats
      if (Array.isArray(result)) {
        return result
      }
      
      // If result is null, undefined, or not an array, return empty array
      return []
    } catch (error) {
      if (error instanceof APIError && (error.status === 500 || error.status === 404)) {
        // If server error or not found, likely no posts exist - return empty array
        console.warn('No posts available or server error, returning empty array:', error.message)
        return []
      }
      throw error
    }
  },

  // Get all posts (admin only)
  getAllPosts: async (): Promise<BlogPost[]> => {
    try {
      const result = await apiCall('/posts/all')
      
      // Handle different response formats
      if (Array.isArray(result)) {
        return result
      }
      
      // If result is null, undefined, or not an array, return empty array
      return []
    } catch (error) {
      if (error instanceof APIError && (error.status === 500 || error.status === 404)) {
        // If server error or not found, likely no posts exist - return empty array
        console.warn('No posts available or server error, returning empty array:', error.message)
        return []
      }
      throw error
    }
  },

  // Get a single post by slug
  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      return await apiCall(`/posts/${encodeURIComponent(slug)}`)
    } catch (error) {
      if (error instanceof APIError && error.status === 404) {
        return null
      }
      throw error
    }
  },

  // Create a new post (admin only)
  createPost: async (postData: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<BlogPost> => {
    // Transform the data to match API expectations
    const createRequest = {
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content,
      author: postData.author,
      authorType: postData.authorType,
      category: postData.category,
      tags: postData.tags,
      readTime: postData.readTime,
      visibility: postData.visibility,
      featured: postData.featured
    }

    return apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify(createRequest)
    })
  },

  // Update an existing post (admin only)
  updatePost: async (post: BlogPost): Promise<BlogPost> => {
    return apiCall(`/posts/${encodeURIComponent(post.slug)}`, {
      method: 'PUT',
      body: JSON.stringify(post)
    })
  },

 // Alternative approach: Update post by ID 
  updatePostById: async (post: BlogPost): Promise<BlogPost> => {
    return apiCall(`/posts/id/${post.id}`, {
      method: 'PUT',
      body: JSON.stringify(post)
    })
  },

  // Delete a post (admin only)
  deletePost: async (slug: string): Promise<void> => {
    await apiCall(`/posts/${encodeURIComponent(slug)}`, {
      method: 'DELETE'
    })
  },

  // Search posts
  searchPosts: async (query: string, userType: UserType): Promise<BlogPost[]> => {
    try {
      const params = new URLSearchParams({
        q: query,
        ...(userType !== 'anonymous' && { userType })
      })
      
      const result = await apiCall(`/posts/search?${params.toString()}`)
      
      // Handle different response formats
      if (Array.isArray(result)) {
        return result
      }
      
      // If result is null, undefined, or not an array, return empty array
      return []
    } catch (error) {
      if (error instanceof APIError && (error.status === 500 || error.status === 404)) {
        // If server error or not found, likely no posts match search - return empty array
        console.warn('No search results or server error, returning empty array:', error.message)
        return []
      }
      throw error
    }
  }
}

// Helper function to get badge information for author types
export const getBadgeInfo = (authorType: AuthorType) => {
  switch (authorType) {
    case 'md':
      return {
        text: 'MD INSIGHT',
        icon: '👑',
        gradient: 'from-[#6a11cb] to-[#2575fc]'
      }
    case 'notice':
      return {
        text: 'URGENT NOTICE',
        icon: '🚨',
        gradient: 'from-[#e74c3c] to-[#c0392b]'
      }
    case 'general':
    default:
      return {
        text: 'GENERAL',
        icon: '📝',
        gradient: 'from-[#00d8e8] to-[#00c4d4]'
      }
  }
}

// Helper function to get visibility badge information
export const getVisibilityBadge = (visibility: Visibility) => {
  switch (visibility) {
    case 'public':
      return {
        text: 'PUBLIC',
        className: 'bg-green-100 text-green-800 border-green-200'
      }
    case 'internal':
      return {
        text: 'INTERNAL',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      }
    case 'restricted':
      return {
        text: 'RESTRICTED',
        className: 'bg-red-100 text-red-800 border-red-200'
      }
    default:
      return {
        text: 'UNKNOWN',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
      }
  }
}

// Utility function to generate URL-friendly slugs
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    .trim()
}

// Utility function to validate post data before creation
export const validatePostData = (postData: Partial<BlogPost>): string[] => {
  const errors: string[] = []
  
  if (!postData.title?.trim()) {
    errors.push('Title is required')
  }
  
  if (!postData.slug?.trim()) {
    errors.push('Slug is required')
  } else if (!/^[a-z0-9-]+$/.test(postData.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens')
  }
  
  if (!postData.excerpt?.trim()) {
    errors.push('Excerpt is required')
  }
  
  if (!postData.content?.trim()) {
    errors.push('Content is required')
  }
  
  if (!postData.author?.trim()) {
    errors.push('Author is required')
  }
  
  if (!postData.category?.trim()) {
    errors.push('Category is required')
  }
  
  if (!postData.readTime?.trim()) {
    errors.push('Read time is required')
  }
  
  if (!['public', 'internal', 'restricted'].includes(postData.visibility || '')) {
    errors.push('Valid visibility level is required')
  }
  
  if (!['general', 'md', 'notice', 'internal', 'admin'].includes(postData.authorType || '')) {
    errors.push('Valid author type is required')
  }
  
  return errors
}