// types/blog.ts
export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string // Full article content
  category: string
  author: string
  publishedAt: string
  readTime: string
  tags: string[]
  authorType: 'md' | 'general' | 'notice'
  slug: string
  visibility: 'public' | 'internal' | 'restricted' // New categorization
  featured?: boolean
}

export interface BlogFilters {
  visibility?: 'public' | 'internal' | 'restricted'
  featured?: boolean
  category?: string
  authorType?: 'md' | 'general' | 'notice'
}

export type UserType = 'anonymous' | 'internal' | 'admin'