'use client'

import { useState, useRef, useEffect } from 'react'
import { FlipWords } from './components/FlipWords'

interface MousePosition {
  x: number
  y: number
}

interface BlogPost {
  id: number
  title: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  readTime: string
  tags: string[]
  featured?: boolean
  authorType: 'md' | 'general' | 'notice' // New field for author categorization
}

export default function BlogPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Future of AI in Software Development",
      excerpt: "Exploring how artificial intelligence is revolutionizing the way we build and maintain software applications, from code generation to automated testing and beyond.",
      category: "AI & Technology",
      author: "Krishna Gummuluri (Managing Director, Parnasoft)",
      publishedAt: "2025-06-15",
      readTime: "8 min read",
      tags: ["AI", "Development", "Future Tech", "Automation"],
      featured: true,
      authorType: 'md'
    },
    {
      id: 2,
      title: "Building Scalable Microservices Architecture",
      excerpt: "A comprehensive guide to designing and implementing microservices that can handle enterprise-level traffic and complexity while maintaining reliability.",
      category: "Architecture",
      author: "Michael Chen",
      publishedAt: "2025-06-12",
      readTime: "12 min read",
      tags: ["Microservices", "Architecture", "Scalability", "Enterprise"],
      featured: false,
      authorType: 'general'
    },
    {
      id: 3,
      title: "Modern CSS Techniques for 2025",
      excerpt: "Discover the latest CSS features and techniques that are shaping modern web design, including container queries and cascade layers.",
      category: "Frontend",
      author: "Emma Rodriguez",
      publishedAt: "2025-06-10",
      readTime: "6 min read",
      tags: ["CSS", "Frontend", "Web Design"],
      featured: false,
      authorType: 'general'
    },
    {
      id: 4,
      title: "Important: New Security Guidelines",
      excerpt: "Essential security protocols and guidelines that all development teams must follow to ensure data protection and system integrity.",
      category: "Security Notice",
      author: "Parnasoft Security Team",
      publishedAt: "2025-06-08",
      readTime: "5 min read",
      tags: ["Security", "Guidelines", "Important"],
      featured: true,
      authorType: 'notice'
    },
    {
      id: 5,
      title: "Understanding GraphQL vs REST APIs",
      excerpt: "A detailed comparison of GraphQL and REST APIs, helping you choose the right approach for your next project based on specific use cases.",
      category: "Backend",
      author: "Lisa Wang",
      publishedAt: "2025-06-05",
      readTime: "7 min read",
      tags: ["GraphQL", "REST", "APIs"],
      featured: false,
      authorType: 'general'
    },
    {
      id: 6,
      title: "Company Vision: Embracing Innovation in 2025",
      excerpt: "My personal thoughts on where Parnasoft is heading and how we're positioning ourselves for the future of technology and innovation.",
      category: "Leadership",
      author: "Krishna Gummuluri (Managing Director, Parnasoft)",
      publishedAt: "2025-06-03",
      readTime: "9 min read",
      tags: ["Vision", "Leadership", "Innovation", "Future"],
      featured: true,
      authorType: 'md'
    }
  ]

  // Filter posts to only show featured ones
  const featuredPosts = blogPosts.filter(post => post.featured === true)

  // Function to get badge info based on author type
  const getBadgeInfo = (authorType: string) => {
    switch (authorType) {
      case 'md':
        return {
          text: 'BY DIRECTOR',
          gradient: 'from-[#ff6b35] to-[#f7931e]',
          icon: '👑'
        }
      case 'notice':
        return {
          text: 'IMPORTANT',
          gradient: 'from-[#e74c3c] to-[#c0392b]',
          icon: '🚨'
        }
      case 'general':
      default:
        return {
          text: 'FEATURED',
          gradient: 'from-[#00d8e8] to-[#00c4d4]',
          icon: '⭐'
        }
    }
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
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8">
            {featuredPosts.map((post, index) => {
              const badgeInfo = getBadgeInfo(post.authorType)
              
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
                  {/* Dynamic Badge based on author type */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-3 py-1 bg-gradient-to-r ${badgeInfo.gradient} text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 animate-pulse`}>
                      <span className="text-sm">{badgeInfo.icon}</span>
                      {badgeInfo.text}
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
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          post.authorType === 'md' 
                            ? 'bg-[#ff6b35]/10 text-[#ff6b35]' 
                            : post.authorType === 'notice'
                            ? 'bg-[#e74c3c]/10 text-[#e74c3c]'
                            : 'bg-[#00d8e8]/10 text-[#00d8e8]'
                        }`}>
                          {post.authorType === 'md' ? 'LEADERSHIP' : post.authorType === 'notice' ? 'NOTICE' : 'ARTICLE'}
                        </span>
                      </div>
                    </div>

                    {/* Post Details */}
                    <div className="mb-6">
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-[#1e3a4b]">
                          <span className="text-[#00d8e8] font-bold">AUTHOR &gt;</span> {post.author}
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
                        <button className={`inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group ${
                          post.authorType === 'md'
                            ? 'bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white hover:from-[#e55a2b] hover:to-[#e08912]'
                            : post.authorType === 'notice'
                            ? 'bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white hover:from-[#d62c1a] hover:to-[#a93226]'
                            : 'bg-[#00d8e8] text-white hover:bg-[#00c4d4]'
                        }`}>
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
        </div>
      </section>
    </div>
  )
}