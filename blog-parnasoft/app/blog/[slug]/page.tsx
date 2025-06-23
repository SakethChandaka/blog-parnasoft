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
        <div className="border-t border-gray-200 pt-8 mb-12">
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
      </article>
    </div>
  )}