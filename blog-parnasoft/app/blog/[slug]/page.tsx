'use client'
//blog slug route Page - app/blog/[slug]/page.tsx
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { blogService, getBadgeInfo, getVisibilityBadge } from '../../services/blogService'
import { BlogPost } from '../../types/blog'
import { UserType } from '../../types/blog'
import { useAuth } from '../../contexts/AuthContext'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState('')
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const router = useRouter()

  // Get user type from auth context
  const { user } = useAuth()
  const userType: UserType = user?.userType || 'anonymous'

  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params)
  
  // Add this useEffect to safely get the current URL
  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const blogPost = await blogService.getPostBySlug(resolvedParams.slug)
        
        if (!blogPost) {
          notFound()
          return
        }

        // Check if user has access to this post based on visibility
        const hasAccess = checkPostAccess(blogPost, userType)
        
        if (!hasAccess) {
          // Instead of notFound(), you might want to show an access denied page
          setError('You do not have permission to view this article.')
          return
        }
        
        setPost(blogPost)
      } catch (err) {
        console.error('Error fetching blog post:', err)
        setError('Failed to load the article. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [resolvedParams.slug, userType])

  // Helper function to check if user can access the post
  const checkPostAccess = (post: BlogPost, userType: UserType): boolean => {
    switch (post.visibility) {
      case 'public':
        return true
      case 'internal':
        return userType === 'internal' || userType === 'admin' || userType === 'super_admin'
      case 'restricted':
        return userType === 'admin' || userType === 'super_admin'
      default:
        return false
    }
  }

  // Handle modal close on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowCreditsModal(false)
      }
    }

    if (showCreditsModal) {
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [showCreditsModal])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00d8e8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1e3a4b] font-semibold">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <p className="text-[#1e3a4b] font-semibold text-lg mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => router.back()} 
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Go Back
            </button>
            <button 
              onClick={() => router.push('/blog')} 
              className="px-6 py-3 bg-[#00d8e8] text-white rounded-lg hover:bg-[#00c4d4] transition-colors duration-200"
            >
              Browse Articles
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return notFound()
  }

  const badgeInfo = getBadgeInfo(post.authorType)
  const visibilityBadge = getVisibilityBadge(post.visibility)

  return (
    <div className="min-h-screen bg-white">
      {/* Global styles for article content */}
      <style jsx global>{`
        .article-content {
          font-family: inherit;
          line-height: 1.7;
          color: #1e3a4b;
        }
        
        .article-content h2 {
          font-size: 1.875rem !important;
          font-weight: 700 !important;
          color: #1e3a4b !important;
          margin-top: 2.5rem !important;
          margin-bottom: 1.5rem !important;
          line-height: 1.3 !important;
          border-bottom: 3px solid #00d8e8 !important;
          padding-bottom: 0.5rem !important;
          display: block !important;
        }
        
        .article-content h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          color: #1e3a4b !important;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
          line-height: 1.4 !important;
          display: block !important;
        }
        
        .article-content p {
          font-size: 1.025rem !important;
          font-weight: 500;
          line-height: 1.7 !important;
          color: #1e3a4b !important;
          margin-bottom: 1.5rem !important;
          text-align: justify !important;
          display: block !important;
        }
        
        .article-content ul {
          margin: 1.5rem 0 !important;
          padding-left: 1.5rem !important;
          list-style-type: disc !important;
        }
        
        .article-content li {
          font-size: 1.0rem !important;
          line-height: 1.7 !important;
          font-weight: 500;
          color: #1e3a4b !important;
          margin-bottom: 0.5rem !important;
          display: list-item !important;
        }
        
        .article-content h2:first-child {
          margin-top: 0 !important;
        }
        
        .article-content h3:last-child {
          background: linear-gradient(135deg, #00d8e8 0%, #00c4d4 100%) !important;
          color: white !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          margin-top: 2rem !important;
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          text-align: center !important;
          border: none !important;
          border-bottom: none !important;
        }

        /* Ensure proper block display for all elements */
        .article-content * {
          box-sizing: border-box;
        }
      `}</style>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-[#00d8e8] hover:text-[#00c4d4] font-semibold transition-colors duration-200 mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </button>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          {/* Badges Container */}
          <div className="flex justify-start gap-4 mb-6">
            {/* Author Type Badge */}
            <span className={`px-4 py-2 bg-gradient-to-r ${badgeInfo.gradient} text-white text-sm font-bold text-center rounded-full shadow-lg flex items-center gap-2`}>
              <span className="text-lg ">{badgeInfo.icon}</span>
              {badgeInfo.text}
            </span>
            
            {/* Visibility Badge */}
            <span className={` flex px-4 py-2 text-sm text-center items-center font-bold rounded-full border ${visibilityBadge.className}`}>
              {visibilityBadge.text}
            </span>

            {/* User Access Level Indicator (for development) */}
            {process.env.NODE_ENV === 'development' && (
              <span className="flex px-3 py-1 bg-gray-100 text-gray-600 items-center text-center text-xs font-bold rounded-full border border-gray-200">
                Access: {userType}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a4b] mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-2 bg-[#00d8e8]/10 text-[#00d8e8] rounded-full text-sm font-semibold">
              {post.category}
            </span>
            <span className="px-4 py-2 bg-[#00d8e8]/10 text-[#00d8e8] rounded-full text-sm font-semibold">
              {post.readTime}
            </span>
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

          {/* Author and Date */}
          <div className="border-l-4 border-[#00d8e8] pl-4 mb-6">
            <p className="text-[#1e3a4b] font-semibold mb-1">
              <span className="text-[#00d8e8] font-bold">BY:</span> {post.author}
            </p>
            <p className="text-[#1e3a4b] font-semibold">
              <span className="text-[#00d8e8] font-bold">PUBLISHED:</span> {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Excerpt */}
          <div className="bg-gradient-to-r from-[#00d8e8]/5 to-[#00d8e8]/10 border-l-4 border-[#00d8e8] rounded-r-lg p-6 mb-8">
            <p className="text-[#1e3a4b] font-semibold text-lg leading-relaxed italic">
              {post.excerpt}
            </p>
          </div>
        </header>

        {/* Article Content with proper styling */}
        <div className="mb-12">
          <div 
            className="article-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#1e3a4b] mb-4">
            <span className="text-[#00d8e8] font-bold">TAGS:</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-[#1e3a4b] text-sm font-medium rounded-lg border border-gray-200 hover:bg-[#00d8e8]/10 hover:border-[#00d8e8] transition-all duration-200 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Social Share */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h3 className="text-lg font-semibold text-[#1e3a4b] mb-4">Share this article</h3>
          <div className="flex gap-4">
            <button
              onClick={() => {
                const url = encodeURIComponent(currentUrl)
                const title = encodeURIComponent(post.title)
                const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`
                window.open(linkedinUrl, '_blank', 'noopener,noreferrer')
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#00d8e8] text-white rounded-lg hover:bg-[#00c4d4] transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Share on LinkedIn
            </button>
            
            {/* Optional: Add more share buttons */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentUrl)
                // You could add a toast notification here
                alert('Link copied to clipboard!')
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
          </div>
        </div>

        {/* Credits & Sources Section */}
        <div className="border-t border-gray-200 pt-8 mb-12">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1e3a4b]">Article Information</h3>
            <button
              onClick={() => setShowCreditsModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00d8e8] to-[#00c4d4] text-white rounded-lg hover:from-[#00c4d4] hover:to-[#00b8c8] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Credits & Sources
            </button>
          </div>
        </div>
      </article>

      {/* Credits Modal */}
      {showCreditsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowCreditsModal(false)}
            ></div>

            {/* Modal content */}
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#00d8e8] to-[#00c4d4] rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-[#1e3a4b]">Credits & Sources</h2>
                </div>
                <button
                  onClick={() => setShowCreditsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Article Info */}
              <div className="bg-gradient-to-r from-[#00d8e8]/5 to-[#00d8e8]/10 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-[#1e3a4b] mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600">
                  Published on {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Credits Content */}
              <div className="space-y-6">
                {/* Author Section */}
                <div>
                  <h4 className="text-lg font-semibold text-[#1e3a4b] mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#00d8e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Author
                  </h4>
                  <div className="pl-7">
                    <p className="text-[#1e3a4b] font-medium">{post.author}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {post.authorType === 'md' ? 'Managing Director' : 
                       post.authorType === 'notice' ? 'Official Notice' : 'Management'}
                    </p>
                  </div>
                </div>

                {/* Research & Sources Section */}
                <div>
                  <h4 className="text-lg font-semibold text-[#1e3a4b] mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#00d8e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Sources & References
                  </h4>
                  <div className="pl-7 space-y-3">
                    {/* You can add actual sources from your BlogPost type if they exist */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm text-gray-600">
                        This article is based on internal research, expert knowledge, and industry best practices. 
                        All information has been reviewed for accuracy and compliance with current standards.
                      </p>
                    </div>
                    
                    {/* If you have sources in your BlogPost type, you can map over them */}
                    {post.sources && post.sources.length > 0 ? (
                      <ul className="space-y-2">
                        {post.sources.map((source, index) => (
                          <li key={index} className="text-sm text-[#1e3a4b] flex items-start gap-2">
                            <span className="text-[#00d8e8] font-bold">{index + 1}.</span>
                            {source.url ? (
                              <a 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#00d8e8] hover:text-[#00c4d4] underline"
                              >
                                {source.title}
                              </a>
                            ) : (
                              <span>{source.title}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No external sources were cited for this article.
                      </p>
                    )}
                  </div>
                </div>

                {/* Editorial Section */}
                <div>
                  <h4 className="text-lg font-semibold text-[#1e3a4b] mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#00d8e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editorial Information
                  </h4>
                  <div className="pl-7 space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium text-[#1e3a4b]">Category:</span> {post.category}</p>
                    <p><span className="font-medium text-[#1e3a4b]">Read Time:</span> {post.readTime}</p>
                    {userType != 'anonymous' && (<p><span className="font-medium text-[#1e3a4b]">Visibility:</span> {post.visibility}</p>)}
                    <p><span className="font-medium text-[#1e3a4b]">Last Updated:</span> {new Date(post.publishedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Disclaimer
                  </h4>
                  <p className="text-xs text-yellow-700">
                    The information provided in this article is for informational purposes only and should not be considered as professional advice. 
                    Please consult with relevant professionals for specific guidance related to your situation.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowCreditsModal(false)}
                  className="px-6 py-2 bg-[#00d8e8] text-white rounded-lg hover:bg-[#00c4d4] transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-gradient-to-r from-[#00d8e8] to-[#00c4d4] text-white rounded-full shadow-lg hover:from-[#00c4d4] hover:to-[#00b8c8] transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}