'use client'
//Main Page - app/page.tsx
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FlipWords } from './components/FlipWords'
import { blogService, getBadgeInfo, getVisibilityBadge } from './services/blogService'
import { BlogPost, UserType } from './types/blog'
import { useAuth } from './contexts/AuthContext'

interface MousePosition {
  x: number
  y: number
}

export default function BlogPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const router = useRouter()

  // Get user type from auth context
  const { user } = useAuth()
  const userType: UserType = user?.userType || 'anonymous'

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get featured posts based on user access level
        const posts = await blogService.getFeaturedPosts(userType)
        
        // Ensure we always have an array, even if API returns something unexpected
        const postsArray = Array.isArray(posts) ? posts : []
        setBlogPosts(postsArray)
        
        // Optional: Log for debugging in development
        if (process.env.NODE_ENV === 'development') {
          console.log('Fetched posts:', postsArray.length, 'posts for user type:', userType)
        }
        
      } catch (err) {
        console.error('Error fetching blog posts:', err)
        
        // More specific error handling
        if (err instanceof Error) {
          if (err.message.includes('500')) {
            setError('Server is experiencing issues. Please try again later.')
          } else if (err.message.includes('404')) {
            setError('No articles found.')
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

    fetchPosts()
  }, [userType]) // Refetch when userType changes

  // Function to navigate to individual blog post
  const handleReadMore = (slug: string) => {
    router.push(`/blog/${slug}`)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!cardRefs.current[index]) return

    const rect = cardRefs.current[index]?.getBoundingClientRect()
    if (rect) {
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  // Retry function for when there's an error
  const handleRetry = async () => {
    setError(null)
    setLoading(true)
    
    try {
      const posts = await blogService.getFeaturedPosts(userType)
      const postsArray = Array.isArray(posts) ? posts : []
      setBlogPosts(postsArray)
    } catch (err) {
      console.error('Retry failed:', err)
      setError('Still unable to load articles. Please try again later.')
      setBlogPosts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00d8e8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1e3a4b] font-semibold">Loading articles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 sm:pt-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-0">
            {/* Header similar to careers page */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-2 mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1e3a4b]">
                EXPLORE
              </h1>
              <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold text-[#00d8e8]">
                <span className="invisible absolute">ARTICLES</span>
                <FlipWords words={["INSIGHTS", "ARTICLES", "STORIES"]} duration={1700} />
              </h1>
            </div>

            {/* Subtitle Box */}
            <div className="inline-block bg-gradient-to-r from-[#00d8e8]/5 to-[#00d8e8]/10 border border-[#00d8e8]/20 rounded-2xl px-4 py-1 mb-6">
              <p className="text-lg text-[#1e3a4b] font-medium">
                <strong>Discover the latest insights, trends, and innovations at <span className="text-[#00d8e8]">Parnasoft.</span></strong>
              </p>
            </div>

            {/* User Access Level Indicator (for development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="inline-block bg-gray-100 border border-gray-300 rounded-lg px-3 py-1 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Access Level:</strong> {userType} • <strong>Posts:</strong> {blogPosts.length}
                  {user && <span> • <strong>User:</strong> {user.name} ({user.email})</span>}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-[#00d8e8] text-6xl mb-4">📝</div>
              <h3 className="text-[#1e3a4b] font-semibold text-xl mb-2">No Articles Available</h3>
              <p className="text-[#1e3a4b] text-sm mb-6">There are currently no articles to display. New content will appear here when published.</p>
              <button 
                onClick={handleRetry}
                className="px-6 py-3 bg-[#00d8e8] text-white rounded-lg hover:bg-[#00c4d4] transition-colors duration-200"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {blogPosts.map((post, index) => {
                const badgeInfo = getBadgeInfo(post.authorType)
                const visibilityBadge = getVisibilityBadge(post.visibility)
                
                return (
                  <div
                    key={post.id}
                    ref={(el) => { cardRefs.current[index] = el }}
                    className={`relative group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 border border-[#00d8e8] ${
                      hoveredCard === index ? 'border-2 border-[#00d8e8]' : 'border border-[#00d8e8]'
                    }`}
                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    id={post.category}
                  >
                    {/* Badges Container */}
                    <div className="absolute w-full top-4 z-20 px-7 flex flex-row gap-2 justify-start">
                      {/* Author Type Badge */}
                      <span className={`px-3 py-1 bg-gradient-to-r ${badgeInfo.gradient} text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 animate-pulse`}>
                        <span className="text-sm">{badgeInfo.icon}</span>
                        {badgeInfo.text}
                      </span>
                      
                      {/* Visibility Badge */}
                      <span className={`flex px-3 py-1 text-xs font-bold text-center items-center rounded-full border ${visibilityBadge.className}`}>
                        {visibilityBadge.text}
                      </span>
                    </div>

                    {/* Special glow effect for MD posts */}
                    {post.authorType === 'md' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35]/5 to-[#f7931e]/5 pointer-events-none z-0" />
                    )}

                    {/* Special urgent effect for notice posts */}
                    {post.authorType === 'notice' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#e74c3c]/5 to-[#c0392b]/5 pointer-events-none z-0" />
                    )}

                    {/* Special effect for internal/restricted posts */}
                    {post.visibility === 'internal' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-yellow-500/5 pointer-events-none z-0" />
                    )}

                    {post.visibility === 'restricted' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/5 to-red-500/5 pointer-events-none z-0" />
                    )}

                    {/* Gradient overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-0"
                      style={{
                        opacity: hoveredCard === index ? 1 : 0,
                        background: hoveredCard === index
                          ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 216, 232, 0.1), transparent 40%)`
                          : "",
                      }}
                    />

                    <div className="relative z-10 p-8">
                      {/* Post Header */}
                      <div className="mb-6 mt-6">
                        <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a4b] mb-4 group-hover:text-[#00d8e8] transition-colors duration-300">
                          {post.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <span className="px-4 py-2 bg-[#00d8e8]/10 text-[#00d8e8] rounded-full text-sm font-semibold">
                            {post.category}
                          </span>
                          <span className="px-4 py-2 bg-[#00d8e8]/10 text-[#00d8e8] rounded-full text-sm font-semibold">
                            {post.readTime}
                          </span>
                          {/* Author type indicator */}
                          <span className={`px-4 py-2 text-sm font-bold rounded-full ${
                            post.authorType === 'md' 
                              ? 'bg-[#ff6b35]/10 text-[#ff6b35]' 
                              : post.authorType === 'notice'
                              ? 'bg-[#e74c3c]/10 text-[#e74c3c]'
                              : 'bg-[#00d8e8]/10 text-[#00d8e8]'
                          }`}>
                            {post.authorType === 'md' ? 'Leadership' : post.authorType === 'notice' ? 'Notice' : 'Article'}
                          </span>
                        </div>
                      </div>

                      {/* Post Details */}
                      <div className="mb-6">
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-[#1e3a4b]">
                            <span className="text-[#00d8e8] font-bold">BY &gt;</span> {post.author}
                          </p>
                          <p className="text-sm font-semibold text-[#1e3a4b]">
                            <span className="text-[#00d8e8] font-bold">PUBLISHED &gt;</span> {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>

                        <div className="mb-6">
                          <p className="text-[#1e3a4b] font-semibold text-sm leading-relaxed">{post.excerpt}</p>
                        </div>

                        {/* Tags */}
                        <div className="mb-6">
                          <p className="text-sm font-semibold text-[#1e3a4b] mb-3">
                            <span className="text-[#00d8e8] font-bold">TAGS &gt;</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 bg-gray-100 text-[#1e3a4b] text-sm font-medium rounded-lg border-1 border-gray-200 hover:bg-[#00d8e8]/10 hover:border-[#00d8e8] transition-all duration-200 cursor-pointer"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Read More Button with dynamic styling */}
                        <div className="flex justify-start">
                          <button 
                            onClick={() => handleReadMore(post.slug)}
                            className={`inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group ${
                              post.authorType === 'md'
                                ? 'bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white hover:from-[#e55a2b] hover:to-[#e08912]'
                                : post.authorType === 'notice'
                                ? 'bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white hover:from-[#d62c1a] hover:to-[#a93226]'
                                : 'bg-[#00d8e8] text-white hover:bg-[#00c4d4]'
                            }`}
                          >
                            {post.authorType === 'notice' ? 'Read Important Notice' : 'Read More'}
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}