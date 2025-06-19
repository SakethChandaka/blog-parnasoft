'use client'
// app/admin/page.tsx - Fixed with all modals included
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { blogService, getBadgeInfo, getVisibilityBadge } from '../services/blogService'
import { BlogPost, UserType, AuthorType, Visibility } from '../types/blog'
import { useAuth } from '../contexts/AuthContext'
import UserManagement from '../components/UserManagement'

interface AdminPageProps {}

type AdminTab = 'blog' | 'users' | 'analytics' | 'settings'

export default function AdminPage({}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('blog')
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterVisibility, setFilterVisibility] = useState<Visibility | 'all'>('all')
  const [filterAuthorType, setFilterAuthorType] = useState<AuthorType | 'all'>('all')
  const router = useRouter()

  // Get user type from auth context
  const { user, loading: authLoading } = useAuth()
  const userType: UserType = user?.userType || 'anonymous'

  useEffect(() => {
    // Wait for auth to load before checking user type
    if (authLoading) {
      return // Still loading auth, don't redirect yet
    }

    // Check if user is admin after auth has loaded
    if (userType !== 'admin') {
      console.log('User is not admin, redirecting. User type:', userType, 'User:', user)
      router.push('/')
      return
    }

    // User is admin, fetch posts only if on blog tab
    if (activeTab === 'blog') {
      fetchAllPosts()
    }
  }, [userType, authLoading, router, user, activeTab])

  const fetchAllPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the working endpoint with admin privileges instead of /posts/all
      const posts = await blogService.getFeaturedPosts('admin')
      
      // Ensure we have an array
      const postsArray = Array.isArray(posts) ? posts : []
      setBlogPosts(postsArray)
      
      // Log for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Admin fetched posts:', postsArray.length, 'posts')
      }
      
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      
      // More specific error handling
      if (err instanceof Error) {
        if (err.message.includes('500')) {
          setError('Server is experiencing issues. Some posts may not be visible.')
        } else if (err.message.includes('404')) {
          setError('No posts endpoint found.')
        } else if (err.message.includes('Network error')) {
          setError('Unable to connect to the server. Please check your internet connection.')
        } else {
          setError('Failed to load blog posts. Please try again later.')
        }
      } else {
        setError('An unexpected error occurred. Please try again later.')
      }
      
      // Set empty array as fallback
      setBlogPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = () => {
    setSelectedPost(null)
    setIsCreateModalOpen(true)
  }

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post)
    setIsEditModalOpen(true)
  }

  const handleDeletePost = (post: BlogPost) => {
    setSelectedPost(post)
    setIsDeleteModalOpen(true)
  }

  const handleToggleVisibility = async (post: BlogPost) => {
    try {
      const newVisibility: Visibility = post.visibility === 'public' ? 'internal' : 
                                      post.visibility === 'internal' ? 'restricted' : 'public'
      
      const updatedPost = { ...post, visibility: newVisibility }
      await blogService.updatePost(updatedPost)
      await fetchAllPosts() // Refresh the list
    } catch (error) {
      console.error('Error toggling post visibility:', error)
      setError('Failed to update post visibility')
    }
  }

  // Enhanced retry function
  const handleRetry = async () => {
    setError(null)
    setLoading(true)
    
    try {
      // Use the working endpoint
      const posts = await blogService.getFeaturedPosts('admin')
      const postsArray = Array.isArray(posts) ? posts : []
      setBlogPosts(postsArray)
      
      if (postsArray.length === 0) {
        setError(null) // Clear error if we successfully got an empty array
      }
    } catch (err) {
      console.error('Retry failed:', err)
      setError('Still unable to load posts. Please try refreshing the page.')
      setBlogPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Filter posts based on search and filters
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesVisibility = filterVisibility === 'all' || post.visibility === filterVisibility
    const matchesAuthorType = filterAuthorType === 'all' || post.authorType === filterAuthorType
    
    return matchesSearch && matchesVisibility && matchesAuthorType
  })

  // Tab configuration
  const tabs = [
    {
      id: 'blog' as AdminTab,
      name: 'Blog Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      count: blogPosts.length
    },
    {
      id: 'users' as AdminTab,
      name: 'User Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      id: 'analytics' as AdminTab,
      name: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'settings' as AdminTab,
      name: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ]

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00d8e8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1e3a4b] font-semibold">Checking permissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1e3a4b]">Administration</h1>
              <p className="text-gray-600 mt-1">Manage your system and content</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Site
              </button>
              {activeTab === 'blog' && (
                <button
                  onClick={handleCreatePost}
                  className="px-6 py-2 bg-[#00d8e8] text-white rounded-lg hover:bg-[#00c4d4] transition-colors duration-200 flex items-center gap-2 font-semibold"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-[#00d8e8] text-[#00d8e8]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.name}
                {tab.count !== undefined && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-[#00d8e8] text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'blog' && (
          <BlogManagementContent
            blogPosts={blogPosts}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterVisibility={filterVisibility}
            setFilterVisibility={setFilterVisibility}
            filterAuthorType={filterAuthorType}
            setFilterAuthorType={setFilterAuthorType}
            filteredPosts={filteredPosts}
            handleRetry={handleRetry}
            handleCreatePost={handleCreatePost}
            handleEditPost={handleEditPost}
            handleDeletePost={handleDeletePost}
            handleToggleVisibility={handleToggleVisibility}
          />
        )}

        {activeTab === 'users' && (
          <UserManagement />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsContent />
        )}

        {activeTab === 'settings' && (
          <SettingsContent />
        )}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <PostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          post={null}
          onSave={fetchAllPosts}
        />
      )}

      {isEditModalOpen && selectedPost && (
        <PostModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          post={selectedPost}
          onSave={fetchAllPosts}
        />
      )}

      {isDeleteModalOpen && selectedPost && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          post={selectedPost}
          onDelete={fetchAllPosts}
        />
      )}
    </div>
  )
}

// Blog Management Content Component
interface BlogManagementContentProps {
  blogPosts: BlogPost[]
  loading: boolean
  error: string | null
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterVisibility: Visibility | 'all'
  setFilterVisibility: (filter: Visibility | 'all') => void
  filterAuthorType: AuthorType | 'all'
  setFilterAuthorType: (filter: AuthorType | 'all') => void
  filteredPosts: BlogPost[]
  handleRetry: () => void
  handleCreatePost: () => void
  handleEditPost: (post: BlogPost) => void
  handleDeletePost: (post: BlogPost) => void
  handleToggleVisibility: (post: BlogPost) => void
}

function BlogManagementContent({
  blogPosts,
  loading,
  error,
  searchTerm,
  setSearchTerm,
  filterVisibility,
  setFilterVisibility,
  filterAuthorType,
  setFilterAuthorType,
  filteredPosts,
  handleRetry,
  handleCreatePost,
  handleEditPost,
  handleDeletePost,
  handleToggleVisibility
}: BlogManagementContentProps) {
  const router = useRouter()

  // Show loading while fetching posts
  if (loading) {
    return (
      <div className="min-h-96 bg-white flex items-center justify-center rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00d8e8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1e3a4b] font-semibold">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-96 bg-white flex items-center justify-center rounded-lg">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-[#1e3a4b] font-semibold text-lg mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={handleRetry} 
              className="px-6 py-3 bg-[#00d8e8] text-white rounded-lg hover:bg-[#00c4d4] transition-colors duration-200"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-[#1e3a4b]">{blogPosts.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#00d8e8]/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-[#00d8e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Public Posts</p>
              <p className="text-2xl font-bold text-green-600">{blogPosts.filter(p => p.visibility === 'public').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Internal Posts</p>
              <p className="text-2xl font-bold text-yellow-600">{blogPosts.filter(p => p.visibility === 'internal').length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Restricted Posts</p>
              <p className="text-2xl font-bold text-red-600">{blogPosts.filter(p => p.visibility === 'restricted').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Posts</label>
            <input
              type="text"
              placeholder="Search by title, author, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value as Visibility | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent"
            >
              <option value="all">All Visibility</option>
              <option value="public">Public</option>
              <option value="internal">Internal</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Author Type</label>
            <select
              value={filterAuthorType}
              onChange={(e) => setFilterAuthorType(e.target.value as AuthorType | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="md">MD</option>
              <option value="notice">Notice</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-[#00d8e8] text-white rounded-lg hover:bg-[#00c4d4] transition-colors duration-200 flex items-center gap-2"
              title="Refresh Posts"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => {
                const badgeInfo = getBadgeInfo(post.authorType)
                const visibilityBadge = getVisibilityBadge(post.visibility)
                
                return (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {post.title}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                              {post.category}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {post.readTime}
                            </span>
                            {post.featured && (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded font-bold">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{post.author}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                            post.authorType === 'md' 
                              ? 'bg-orange-100 text-orange-800' 
                              : post.authorType === 'notice'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {badgeInfo.text}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full cursor-pointer transition-colors ${visibilityBadge.className}`}
                            onClick={() => handleToggleVisibility(post)}>
                        {visibilityBadge.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/blog/${post.slug}`)}
                          className="text-[#00d8e8] hover:text-[#00c4d4] transition-colors"
                          title="View Post"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-blue-600 hover:text-blue-500 transition-colors"
                          title="Edit Post"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeletePost(post)}
                          className="text-red-600 hover:text-red-500 transition-colors"
                          title="Delete Post"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filteredPosts.length === 0 && blogPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📝</div>
            <h3 className="text-gray-500 font-medium text-lg mb-2">No Posts Found</h3>
            <p className="text-gray-400 text-sm mb-4">Create your first blog post to get started.</p>
            <button
              onClick={handleCreatePost}
              className="px-6 py-3 bg-[#00d8e8] text-white rounded-lg hover:bg-[#00c4d4] transition-colors duration-200"
            >
              Create First Post
            </button>
          </div>
        )}
        {filteredPosts.length === 0 && blogPosts.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <p className="text-gray-500 font-medium">No posts found matching your search criteria.</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Analytics Content Component
function AnalyticsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h3 className="text-gray-500 font-medium text-lg mb-2">Analytics Dashboard</h3>
        <p className="text-gray-400 text-sm">Coming soon - View detailed analytics and insights.</p>
      </div>
    </div>
  )
}

// Settings Content Component
function SettingsContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="text-gray-400 text-6xl mb-4">⚙️</div>
        <h3 className="text-gray-500 font-medium text-lg mb-2">System Settings</h3>
        <p className="text-gray-400 text-sm">Coming soon - Configure system settings and preferences.</p>
      </div>
    </div>
  )
}

// Post Modal Component (Create/Edit)
interface PostModalProps {
  isOpen: boolean
  onClose: () => void
  post: BlogPost | null
  onSave: () => void
}

function PostModal({ isOpen, onClose, post, onSave }: PostModalProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author: post?.author || '',
    category: post?.category || '',
    tags: post?.tags.join(', ') || '',
    authorType: post?.authorType || 'general' as AuthorType,
    visibility: post?.visibility || 'public' as Visibility,
    readTime: post?.readTime || '5 min read',
    featured: post?.featured || false
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)

    try {
      const postData: Partial<BlogPost> = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        publishedAt: post?.publishedAt || new Date().toISOString()
      }

      if (post) {
        await blogService.updatePost({ ...post, ...postData } as BlogPost)
      } else {
        await blogService.createPost(postData as Omit<BlogPost, 'id' | 'publishedAt'>)
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving post:', error)
      setSaveError(error instanceof Error ? error.message : 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#1e3a4b]">
            {post ? 'Edit Post' : 'Create New Post'}
          </h2>
        </div>
        
        {saveError && (
          <div className="px-6 pt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800">{saveError}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
              <input
                type="text"
                required
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author Type</label>
              <select
                value={formData.authorType}
                onChange={(e) => setFormData({ ...formData, authorType: e.target.value as AuthorType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="md">MD</option>
                <option value="notice">Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as Visibility })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="internal">Internal</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="technology, innovation, development"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              required
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content (HTML)</label>
            <textarea
              required
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00d8e8] focus:border-transparent font-mono text-sm"
              placeholder="Enter your HTML content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Post</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-[#00d8e8] focus:ring-[#00d8e8] border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Mark as featured post
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#00d8e8] text-white rounded-lg hover:bg-[#00c4d4] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Delete Modal Component
interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  post: BlogPost
  onDelete: () => void
}

function DeleteModal({ isOpen, onClose, post, onDelete }: DeleteModalProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await blogService.deletePost(post.slug) // Use slug instead of title
      onDelete()
      onClose()
    } catch (error) {
      console.error('Error deleting post:', error)
    } finally {
      setDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Post</h3>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>"{post.title}"</strong>?
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}