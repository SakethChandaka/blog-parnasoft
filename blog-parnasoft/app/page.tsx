'use client'
//Main Page - app/page.tsx
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

  // Separate posts into important and general
  const importantPosts = blogPosts.filter(post => post.authorType === 'md' || post.authorType === 'notice')
  const generalPosts = blogPosts.filter(post => post.authorType !== 'md' && post.authorType !== 'notice')

  // Render card for important posts
  const renderImportantCard = (post: BlogPost, index: number) => {
    const badgeInfo = getBadgeInfo(post.authorType)
    
    return (
      <div
        key={post.id}
        ref={(el) => { cardRefs.current[index] = el }}
        className={`relative group rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-2 mb-6 ${
          post.authorType === 'md' 
            ? 'border-orange-300 hover:border-orange-400' 
            : 'border-red-300 hover:border-red-400'
        }`}
        style={{ animationDelay: `${0.1 + index * 0.1}s` }}
        onMouseEnter={() => setHoveredCard(index)}
        onMouseLeave={() => setHoveredCard(null)}
        onMouseMove={(e) => handleMouseMove(e, index)}
      >
        {/* Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className={`px-3 py-1 bg-gradient-to-r ${badgeInfo.gradient} text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1`}>
            <span className="text-sm">{badgeInfo.icon}</span>
            {badgeInfo.text}
          </span>
        </div>

        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-0 rounded-2xl"
          style={{
            opacity: hoveredCard === index ? 1 : 0,
            background: hoveredCard === index
              ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 143, 90, 0.1), transparent 40%)`
              : "",
          }}
        />

        <div className="relative z-10 p-6">
          <div className="mb-4 mt-6">
            <h2 className={`text-xl lg:text-2xl font-bold mb-3 ${
              post.authorType === 'md' ? 'text-orange-800 group-hover:text-orange-600' : 'text-red-800 group-hover:text-red-600'
            } transition-colors duration-300`}>
              {post.title}
            </h2>
            
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                post.authorType === 'md' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {post.category}
              </span>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                post.authorType === 'md' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {post.readTime}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-3">
              <p className={`text-sm font-semibold ${
                post.authorType === 'md' ? 'text-orange-700' : 'text-red-700'
              }`}>
                <span className="font-bold">BY &gt;</span> {post.author}
              </p>
              <p className={`text-sm font-semibold ${
                post.authorType === 'md' ? 'text-orange-700' : 'text-red-700'
              }`}>
                <span className="font-bold">PUBLISHED &gt;</span> {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="mb-4">
              {/*<p className={`font-semibold text-sm leading-relaxed ${
                post.authorType === 'md' ? 'text-orange-800' : 'text-red-800'
              }`}>
                {post.excerpt}
              </p>*/}
            </div>

            <div className="flex justify-start">
              <button 
                onClick={() => handleReadMore(post.slug)}
                className={`inline-flex items-center px-5 py-2 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group ${
                  post.authorType === 'md'
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {post.authorType === 'notice' ? 'Read Notice' : 'Read More'}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render full card for general posts
  const renderGeneralCard = (post: BlogPost, index: number) => {
    const badgeInfo = getBadgeInfo(post.authorType)
    const visibilityBadge = getVisibilityBadge(post.visibility)
    
    return (
      <div
        key={post.id}
        ref={(el) => { cardRefs.current[index + importantPosts.length] = el }}
        className={`relative group overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 transform  border border-[#00d8e8] mb-6 ${
          hoveredCard === index + importantPosts.length ? 'border border-[#00d8e8]' : 'border border-[#00d8e8]'
        }`}
        style={{ animationDelay: `${0.1 + index * 0.1}s` }}
        onMouseEnter={() => setHoveredCard(index + importantPosts.length)}
        onMouseLeave={() => setHoveredCard(null)}
        onMouseMove={(e) => handleMouseMove(e, index + importantPosts.length)}
      >
        {/* Badges Container */}
        <div className="absolute w-full top-4 z-20 px-6 flex flex-row gap-2 justify-start">
          <span className={`px-3 py-1 bg-gradient-to-r ${badgeInfo.gradient} text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1`}>
            <span className="text-sm">{badgeInfo.icon}</span>
            {badgeInfo.text}
          </span>
          
          <span className={`flex px-3 py-1 text-xs font-bold text-center items-center rounded-full border ${visibilityBadge.className}`}>
            {visibilityBadge.text}
          </span>
        </div>

        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none z-0"
          style={{
            opacity: hoveredCard === index + importantPosts.length ? 1 : 0,
            background: hoveredCard === index + importantPosts.length
              ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 216, 232, 0.1), transparent 40%)`
              : "",
          }}
        />

        <div className="relative z-10 p-6">
          <div className="mb-4 mt-6">
            <h2 className="text-xl lg:text-2xl font-bold text-[#1e3a4b] mb-3 group-hover:text-[#00d8e8] transition-colors duration-300">
              {post.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-[#00d8e8]/10 text-[#00d8e8] rounded-full text-sm font-semibold">
                {post.category}
              </span>
              <span className="px-3 py-1 bg-[#00d8e8]/10 text-[#00d8e8] rounded-full text-sm font-semibold">
                {post.readTime}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-3">
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

            <div className="mb-4">
              {/*<p className="text-[#1e3a4b] font-semibold text-sm leading-relaxed">{post.excerpt}</p>*/}
            </div>

            <div className="mb-4">
              {/*<p className="text-sm font-semibold text-[#1e3a4b] mb-2">
                <span className="text-[#00d8e8] font-bold">TAGS &gt;</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-gray-100 text-[#1e3a4b] text-xs font-medium rounded-lg border-1 border-gray-200 hover:bg-[#00d8e8]/10 hover:border-[#00d8e8] transition-all duration-200 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>*/}
            </div>

            <div className="flex justify-start">
              <button 
                onClick={() => handleReadMore(post.slug)}
                className="inline-flex items-center px-5 py-2 bg-[#00d8e8] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl hover:bg-[#00c4d4] group"
              >
                Read More
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Loading articles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-purple-600 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-white text-6xl mb-4">⚠️</div>
          <p className="text-white font-semibold text-lg mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={handleRetry} 
              className="px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-orange-600 transition-colors duration-200 font-semibold"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Mobile Layout - Stacked Sections */}
      <div className="[@media(min-width:1000px)]:hidden">
        {/* Important Updates Section - Mobile */}
        <div className="min-h-auto bg-gradient-to-br from-orange-400 via-red-400 to-red-500">
          <div className="h-full flex flex-col pb-5">
            {/* Header Section */}
            <div className="p-6">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                  Important Updates
                </h1>
                <p className="text-base text-white/90 font-medium mb-6">
                  Critical announcements and insights from our leadership team
                </p>
                
                {/* User Access Level Indicator (for development) */}
                {process.env.NODE_ENV === 'production' && (
                  <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 mb-6">
                    <p className="text-sm text-white">
                      <strong>Access:</strong> {userType} • <strong>Posts:</strong> {blogPosts.length}
                      {user && <span> • <strong>User:</strong> {user.name}</span>}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-8">
              <div className="flex flex-col justify-top w-full space-y-1">
                {importantPosts.length === 0 ? (
                  <div className="text-center py-8 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="text-white/70 text-4xl mb-3">📋</div>
                    <p className="text-white/90 font-medium">No important updates available</p>
                  </div>
                ) : (
                  importantPosts
                    .slice()
                    .reverse()
                    .map((post, index) => (
                      <div
                        key={post.id}
                        className="animate-slide-in-left"
                        style={{ 
                          animationDelay: `${index * 0.1}s`,
                          transform: 'translateY(30px)',
                          opacity: 0,
                          animation: `slideInUp 0.6s ease-out ${index * 0.1}s forwards`
                        }}
                      >
                        {renderImportantCard(post, index)}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Latest Articles Section - Mobile */}
        <div className="min-h-screen bg-gradient-to-bl from-cyan-400 via-blue-500 to-purple-600">
          <div className="h-full flex flex-col pb-5">
            {/* Header Section */}
            <div className="p-6">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                  Latest Articles
                </h1>
                <p className="text-base text-white/90 font-medium mb-6">
                  Explore insights and innovations at Parnasoft
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-8">
              <div className="flex flex-col justify-top w-full space-y-1">
                {generalPosts.length === 0 ? (
                  <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="text-white/70 text-6xl mb-4">📝</div>
                    <h3 className="text-white font-semibold text-xl mb-2">No Articles Available</h3>
                    <p className="text-white/90">New content will appear here when published</p>
                  </div>
                ) : (
                  generalPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-slide-in-right"
                      style={{ 
                        animationDelay: `${index * 0.15}s`,
                        transform: 'translateY(30px)',
                        opacity: 0,
                        animation: `slideInUp 0.6s ease-out ${index * 0.15}s forwards`
                      }}
                    >
                      {renderGeneralCard(post, index)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Side by Side Sections */}
      <div className="hidden [@media(min-width:1001px)]:block">
        {/* Left Section - Important Updates */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-400 to-red-500"
          style={{
            clipPath: 'polygon(0 0, 55% 0, 45% 100%, 0 100%)'
          }}
        >
          {/* Content Container */}
          <div className="relative h-full flex flex-col pb-5 pl-5">
            {/* Header Section */}
            <div className="p-6 xl:p-10">
              <div className="max-w-2xl">
                <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                  Important
                  <br />
                  Updates
                </h1>
                <p className="text-l text-white/90 font-medium mb-6">
                  Critical announcements and insights from our <br/>leadership team
                </p>
                
                {/* User Access Level Indicator (for development) */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 mb-6">
                    <p className="text-sm text-white">
                      <strong>Access:</strong> {userType} • <strong>Posts:</strong> {blogPosts.length}
                      {user && <span> • <strong>User:</strong> {user.name}</span>}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-8">
              <div className="flex flex-col justify-top sm:w-full max-w-sm space-y-1 ml-[10px] xl:ml-[100px]">
                {importantPosts.length === 0 ? (
                  <div className="text-center py-8 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <div className="text-white/70 text-4xl mb-3">📋</div>
                    <p className="text-white/90 font-medium">No important updates available</p>
                  </div>
                ) : (
                  importantPosts
                    .slice()
                    .reverse()
                    .map((post, index) => (
                      <div
                        key={post.id}
                        className="animate-slide-in-left"
                        style={{ 
                          animationDelay: `${index * 0.1}s`,
                          transform: 'translateY(30px)',
                          opacity: 0,
                          animation: `slideInUp 0.6s ease-out ${index * 0.1}s forwards`
                        }}
                      >
                        {renderImportantCard(post, index)}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Latest Articles */}
        <div 
          className="absolute inset-0 bg-gradient-to-bl from-cyan-400 via-blue-500 to-purple-600"
          style={{
            clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 45% 100%)'
          }}
        >
          {/* Content Container */}
          <div className="relative h-full flex flex-col pb-5 mb-5">
            {/* Header Section */}
            <div className="p-6 xl:p-10 flex justify-end">
              <div className="max-w-2xl text-right">
                <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                  Latest
                  <br />
                  Articles
                </h1>
                <p className="text-l text-white/90 font-medium mb-6">
                  Explore insights and innovations at Parnasoft
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-8 flex justify-end p-4">
              <div className="flex flex-col justify-top sm:w-full max-w-sm space-y-1 mr-[10px] xl:mr-[100px]">
                {generalPosts.length === 0 ? (
                  <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="text-white/70 text-6xl mb-4">📝</div>
                    <h3 className="text-white font-semibold text-xl mb-2">No Articles Available</h3>
                    <p className="text-white/90">New content will appear here when published</p>
                  </div>
                ) : (
                  generalPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-slide-in-right"
                      style={{ 
                        animationDelay: `${index * 0.15}s`,
                        transform: 'translateY(30px)',
                        opacity: 0,
                        animation: `slideInUp 0.6s ease-out ${index * 0.15}s forwards`
                      }}
                    >
                      {renderGeneralCard(post, index)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        /* Custom scrollbars */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        .scroll-fade-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent);
          backdrop-filter: blur(8px);
          z-index: 30;
          pointer-events: none;
        }

        .scroll-fade-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent);
          backdrop-filter: blur(8px);
          z-index: 30;
          pointer-events: none;
        }

        .scroll-fade-top-left {
          background: linear-gradient(to bottom, rgba(255, 143, 90, 0.8), transparent);
        }

        .scroll-fade-bottom-left {
          background: linear-gradient(to top, rgba(255, 143, 90, 0.8), transparent);
        }

        .scroll-fade-top-right {
          background: linear-gradient(to bottom, rgba(0, 216, 232, 0.8), transparent);
        }

        .scroll-fade-bottom-right {
          background: linear-gradient(to top, rgba(0, 216, 232, 0.8), transparent);
        }
      `}</style>
    </div>
  )
}