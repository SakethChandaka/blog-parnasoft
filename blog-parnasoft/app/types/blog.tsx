// app/types/blog.ts

export type UserType = 'anonymous' | 'internal' | 'admin'

export type AuthorType = 'md' | 'general' | 'notice' // Using your original values

export type Visibility = 'public' | 'internal' | 'restricted'

export interface BlogPost {
  id: number // Keep as number from your original
  title: string
  slug: string
  excerpt: string
  content: string // Full article content
  author: string
  authorType: AuthorType
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  visibility: Visibility
  featured?: boolean // Keep your original featured property
}

// Your original BlogFilters interface (keeping it)
export interface BlogFilters {
  visibility?: 'public' | 'internal' | 'restricted'
  featured?: boolean
  category?: string
  authorType?: 'md' | 'general' | 'notice'
}

// Additional interfaces for admin functionality
export interface CreatePostData {
  title: string
  excerpt: string
  content: string
  author: string
  authorType: AuthorType
  category: string
  tags: string[]
  readTime: string
  visibility: Visibility
  featured?: boolean
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: number
}

export interface BlogStats {
  totalPosts: number
  publicPosts: number
  internalPosts: number
  restrictedPosts: number
  mdPosts: number
  noticePosts: number
  generalPosts: number // Updated to match 'general' instead of 'author'
}

export interface SearchFilters {
  query?: string
  category?: string
  authorType?: AuthorType | 'all'
  visibility?: Visibility | 'all'
  dateFrom?: string
  dateTo?: string
  tags?: string[]
  featured?: boolean
}