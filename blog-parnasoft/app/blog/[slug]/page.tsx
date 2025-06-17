'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'

interface BlogPost {
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
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// This would normally come from your Azure Function
const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  // Hardcoded data for now - replace with Azure Function call
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Future of AI in Software Development",
      excerpt: "Exploring how artificial intelligence is revolutionizing the way we build and maintain software applications, from code generation to automated testing and beyond.",
      content: `
        <h2>Introduction</h2>
        <p>Artificial Intelligence is transforming the software development landscape at an unprecedented pace. From automated code generation to intelligent testing frameworks, AI is not just changing how we write code—it's revolutionizing how we think about software development entirely.</p>
        
        <h2>The Current State of AI in Development</h2>
        <p>Today's development teams are already leveraging AI tools for various aspects of their workflow. Code completion tools like GitHub Copilot and Tabnine are becoming standard in many IDEs, while AI-powered testing frameworks are helping teams catch bugs earlier in the development cycle.</p>
        
        <h2>Key Areas of Impact</h2>
        <h3>Code Generation and Completion</h3>
        <p>AI-powered code generators can now produce entire functions, classes, and even complete applications based on natural language descriptions. This capability is particularly powerful for boilerplate code and common programming patterns.</p>
        
        <h3>Automated Testing</h3>
        <p>AI systems can analyze code changes and automatically generate test cases, identify potential edge cases, and even predict which areas of the codebase are most likely to contain bugs.</p>
        
        <h3>Code Review and Quality Assurance</h3>
        <p>Machine learning models trained on millions of code repositories can identify code smells, suggest improvements, and flag potential security vulnerabilities before they make it into production.</p>
        
        <h2>The Road Ahead</h2>
        <p>As we look toward the future, AI's role in software development will only continue to expand. We can expect to see more sophisticated AI assistants that can understand project context, suggest architectural improvements, and even help with project management tasks.</p>
        
        <h2>Conclusion</h2>
        <p>The integration of AI into software development represents a fundamental shift in how we approach building software. While it won't replace human developers, it will undoubtedly make them more productive and enable them to focus on higher-level creative and strategic tasks.</p>
      `,
      category: "AI & Technology",
      author: "Krishna Gummuluri (Managing Director, Parnasoft)",
      publishedAt: "2025-06-15",
      readTime: "8 min read",
      tags: ["AI", "Development", "Future Tech", "Automation"],
      authorType: 'md',
      slug: "future-of-ai-in-software-development"
    },
    {
      id: 2,
      title: "The Scaling Imperative",
      excerpt: "A comprehensive guide to designing and implementing microservices that can handle enterprise-level traffic and complexity while maintaining reliability.",
      content: `
        <h2>Why Building for Tomorrow Defines Success in Software and Business</h2>
        <p>In the technology industry, there's a fundamental truth that separates lasting success from temporary wins: the ability to build with scale in mind from day one. This principle applies equally to software development and business operations, and understanding this connection has become critical for any organization seeking real growth.</p>
        
        <h2>The Reality Check: Easy vs. Scalable</h2>
        <p>Anyone can build software today. The internet is full of tutorials, there are tools that practically write code for you, and frameworks handle most of the heavy lifting. You can get an app running over a weekend. Similarly, anyone can start a small business and manage a few employees.
            But here's where things get interesting – building something that works and building something that scales are completely different challenges. It's like the difference between cooking for your family and running a restaurant kitchen during rush hour. The basic skills might overlap, but the planning, systems, and strategic thinking required are worlds apart.
            This misconception creates a dangerous blind spot. Many entrepreneurs and developers think they understand the full scope of their challenge when they've only scratched the surface.
        </p>
        
        <h2>Business Scaling: The Same Challenge in Different Clothes</h2>
        <p>Running a business follows the same pattern. Managing five people requires different skills than leading fifty, just as a ten-user application needs different architecture than a ten-thousand-user platform.
            Anyone can handle a small team where everyone knows each other and communication happens naturally. But successful business scaling requires systematic thinking about processes, communication structures, decision-making frameworks, and how to preserve company culture during rapid growth.
            The hard part is building systems that work without you being directly involved in every decision. Many business owners struggle with this because it means giving up the hands-on control that got them started.
        </p>
        
        <h2>The Parnasoft Approach: Thinking Three Steps Ahead</h2>
        <p>Throughout Parnasoft's growth, one principle has guided both client software development and internal business operations: every decision must consider not just what's needed today, but what will be needed tomorrow. This methodology has proven essential in delivering software solutions that stay strong and efficient as client businesses expand.
            When working with clients, the focus goes beyond immediate technical requirements to understand the bigger picture. Where does the client want their business to be in three years? That answer directly influences the architectural decisions made today. This approach has consistently prevented the expensive rebuilds that hit companies who focus only on immediate needs.
            The same thinking shapes internal decisions at Parnasoft. Instead of just filling today's gaps, hiring and process decisions consider what the company will need as it takes on larger projects and serves more demanding clients.
        </p>
        
        <h2>The Technical Reality: Why Scale Matters</h2>
        <p>Scalable software involves complex technical considerations that users never see but that determine whether systems survive growth. Database optimization, caching strategies, load balancing, microservices architecture, API design, and security protocols all require expert-level implementation to handle exponential growth effectively.
            Here's the brutal truth: these technical requirements can't be added to existing systems as an afterthought. The cost and complexity of rebuilding functional but non-scalable software often costs more than starting over completely.
        </p>

        <h2>Strategic Business Architecture: Building Systems That Work</h2>
        <p>Business scaling demands similar strategic architecture. Organizational structures, communication methods, performance management systems, and decision-making processes must be designed for growth, not just current operations.
            Companies that skip this step frequently hit what experts call "complexity collapse" – the point where adding more people or customers actually makes the organization less effective, not more effective.
        </p>

        <h2>The Investment Reality: Paying Now vs. Paying Later</h2>
        <p>Both scalable software and scalable business operations require upfront investments that seem unnecessary for current needs. This creates a tough situation where leaders must spend money on problems they haven't encountered yet.
            However, industry experience shows the same pattern repeatedly: implementing scalable solutions from the beginning costs substantially less than rebuilding when growth exceeds system capabilities. This applies whether you're talking about database architecture or management structures.
        </p>

        <h2>What Separates the Professionals from Everyone Else</h2>
        <p>What distinguishes professional software developers from casual programmers is the ability to solve problems that don't exist yet. Professional developers build systems that perform better as load increases, accommodate new features without major changes, and remain maintainable as development teams expand.
            The same principle applies to business leadership. What separates successful business leaders from small-scale managers is creating organizational systems that become more effective as they scale, rather than more chaotic.
            Anyone can manage what they can see and control directly. The real skill is building systems that work when you're not in the room.
        </p>

        <h2>The Competitive Edge in Today's Market</h2>
        <p>In today's fast-moving business environment, the companies that achieve sustainable competitive advantage are those with the technical infrastructure and organizational capability to adapt quickly when markets change. This adaptability depends entirely on having scalable foundations in place before growth demands them.
            Parnasoft's continued success and client achievements reflect the practical application of these principles. By consistently choosing scalable solutions over quick fixes – both in client software development and internal business operations – sustainable growth becomes achievable rather than accidental.
        </p>

        <h2>The Bottom Line</h2>
        <p>The difference between functional systems and scalable systems – whether in software or business – represents the gap between temporary success and lasting achievement. Building for scale requires expertise, strategic thinking, and investment that extend beyond immediate requirements.
            Organizations that embrace this principle position themselves for growth that strengthens their foundations rather than straining them. Those that don't inevitably face the expensive and disruptive process of rebuilding what should have been built correctly from the start. The choice is simple: build for today and rebuild tomorrow, or build for tomorrow and grow confidently today.
        </p>
        <h3>Parnasoft specializes in developing scalable software solutions and organizational systems that grow stronger with expansion. Our expertise in both technical architecture and business scaling ensures that your investments today support your ambitions tomorrow.</h3>
      `,
      category: "Architecture",
      author: "Krishna Gummuluri (Managing Director, Parnasoft)",
      publishedAt: "2025-06-17",
      readTime: "12 min read",
      tags: ["Design", "Architecture", "Scalability", "Enterprise"],
      authorType: 'md',
      slug: "The-Scaling-Imperative"
    },
    {
      id: 3,
      title: "Modern CSS Techniques for 2025",
      excerpt: "Discover the latest CSS features and techniques that are shaping modern web design, including container queries and cascade layers.",
      content: `
        <h2>The Evolution of CSS</h2>
        <p>CSS continues to evolve rapidly, with new features being added regularly that make styling more powerful and intuitive than ever before.</p>
        
        <h2>Container Queries</h2>
        <p>Container queries allow you to apply styles based on the size of a container rather than the viewport, enabling truly modular component design.</p>
        
        <h2>Cascade Layers</h2>
        <p>The @layer rule provides explicit control over the cascade, making it easier to manage styles in large applications.</p>
        
        <h2>Modern Layout Techniques</h2>
        <p>CSS Grid and Flexbox have matured, and new properties like subgrid make complex layouts easier to implement.</p>
        
        <h2>Conclusion</h2>
        <p>These modern CSS techniques enable developers to create more maintainable and responsive designs with less code.</p>
      `,
      category: "Frontend",
      author: "Emma Rodriguez",
      publishedAt: "2025-06-10",
      readTime: "6 min read",
      tags: ["CSS", "Frontend", "Web Design"],
      authorType: 'general',
      slug: "modern-css-techniques-for-2025"
    },
    {
      id: 4,
      title: "Important: New Security Guidelines",
      excerpt: "Essential security protocols and guidelines that all development teams must follow to ensure data protection and system integrity.",
      content: `
        <h2>Security Alert</h2>
        <p>This document outlines critical security measures that must be implemented immediately across all projects.</p>
        
        <h2>Authentication Requirements</h2>
        <p>All applications must implement multi-factor authentication and strong password policies.</p>
        
        <h2>Data Protection</h2>
        <p>Sensitive data must be encrypted both at rest and in transit using industry-standard encryption algorithms.</p>
        
        <h2>Access Control</h2>
        <p>Implement role-based access control (RBAC) and principle of least privilege for all system access.</p>
        
        <h2>Monitoring and Auditing</h2>
        <p>All security events must be logged and monitored for suspicious activity.</p>
        
        <h2>Compliance</h2>
        <p>These guidelines ensure compliance with GDPR, HIPAA, and other relevant regulations.</p>
      `,
      category: "Security Notice",
      author: "Parnasoft Security Team",
      publishedAt: "2025-06-08",
      readTime: "5 min read",
      tags: ["Security", "Guidelines", "Important"],
      authorType: 'notice',
      slug: "new-security-guidelines"
    },
    {
      id: 5,
      title: "Understanding GraphQL vs REST APIs",
      excerpt: "A detailed comparison of GraphQL and REST APIs, helping you choose the right approach for your next project based on specific use cases.",
      content: `
        <h2>API Architecture Comparison</h2>
        <p>When building modern applications, choosing the right API architecture is crucial for performance and maintainability.</p>
        
        <h2>REST APIs</h2>
        <p>REST (Representational State Transfer) has been the standard for web APIs for many years, offering simplicity and wide adoption.</p>
        
        <h3>REST Advantages</h3>
        <ul>
          <li>Simple and well-understood</li>
          <li>Excellent caching support</li>
          <li>Wide tooling support</li>
          <li>HTTP status codes provide clear feedback</li>
        </ul>
        
        <h2>GraphQL</h2>
        <p>GraphQL provides a more flexible approach to API design, allowing clients to request exactly the data they need.</p>
        
        <h3>GraphQL Advantages</h3>
        <ul>
          <li>Single endpoint for all data</li>
          <li>Strong type system</li>
          <li>Reduced over-fetching</li>
          <li>Excellent developer tools</li>
        </ul>
        
        <h2>When to Choose What</h2>
        <p>Choose REST for simple applications with well-defined resources. Choose GraphQL for complex applications with varied data requirements.</p>
        
        <h2>Conclusion</h2>
        <p>Both REST and GraphQL have their place in modern development. The choice depends on your specific requirements and team expertise.</p>
      `,
      category: "Backend",
      author: "Lisa Wang",
      publishedAt: "2025-06-05",
      readTime: "7 min read",
      tags: ["GraphQL", "REST", "APIs"],
      authorType: 'general',
      slug: "understanding-graphql-vs-rest-apis"
    },
    {
      id: 6,
      title: "Company Vision: Embracing Innovation in 2025",
      excerpt: "My personal thoughts on where Parnasoft is heading and how we're positioning ourselves for the future of technology and innovation.",
      content: `
        <h2>A Message from Leadership</h2>
        <p>As we move into 2025, I want to share my vision for Parnasoft and how we're positioning ourselves for the future of technology.</p>
        
        <h2>Our Technology Focus</h2>
        <p>We're investing heavily in emerging technologies including AI, machine learning, and cloud-native solutions to stay at the forefront of innovation.</p>
        
        <h2>Team Growth and Development</h2>
        <p>Our people are our greatest asset. We're committed to continuous learning and providing opportunities for our team to grow and excel.</p>
        
        <h2>Client Success</h2>
        <p>Our clients' success is our success. We're dedicated to delivering solutions that drive real business value and competitive advantage.</p>
        
        <h2>Sustainability and Social Responsibility</h2>
        <p>We're committed to building technology that not only drives business success but also contributes positively to society and the environment.</p>
        
        <h2>Looking Forward</h2>
        <p>The future is bright for Parnasoft. With our talented team, innovative approach, and commitment to excellence, we're ready to tackle the challenges and opportunities that lie ahead.</p>
        
        <h2>Conclusion</h2>
        <p>I'm excited about what we'll accomplish together in 2025 and beyond. Thank you for being part of the Parnasoft journey.</p>
      `,
      category: "Leadership",
      author: "Krishna Gummuluri (Managing Director, Parnasoft)",
      publishedAt: "2025-06-03",
      readTime: "9 min read",
      tags: ["Vision", "Leadership", "Innovation", "Future"],
      authorType: 'md',
      slug: "company-vision-embracing-innovation-2025"
    }
  ]
  
  return blogPosts.find(post => post.slug === slug) || null
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const blogPost = await getBlogPostBySlug(params.slug)
        if (!blogPost) {
          notFound()
          return
        }
        setPost(blogPost)
        
        // Fetch related posts (you can implement this logic)
        // For now, we'll just set empty array
        setRelatedPosts([])
      } catch (error) {
        console.error('Error fetching blog post:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

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

  if (!post) {
    return notFound()
  }

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

  const badgeInfo = getBadgeInfo(post.authorType)

  return (
    <div className="min-h-screen bg-white">
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
          {/* Badge */}
          <div className="flex justify-start mb-6">
            <span className={`px-4 py-2 bg-gradient-to-r ${badgeInfo.gradient} text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2`}>
              <span className="text-lg">{badgeInfo.icon}</span>
              {badgeInfo.text}
            </span>
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

          {/* Author and Date */}
          <div className="border-l-4 border-[#00d8e8] pl-4 mb-6">
            <p className="text-[#1e3a4b] font-semibold mb-1">
              <span className="text-[#00d8e8] font-bold">AUTHOR:</span> {post.author}
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
          <style jsx>{`
            .article-content h2 {
              font-size: 1.875rem;
              font-weight: 700;
              color: #1e3a4b;
              margin-top: 2.5rem;
              margin-bottom: 1.5rem;
              line-height: 1.3;
              border-bottom: 3px solid #00d8e8;
              padding-bottom: 0.5rem;
            }
            
            .article-content h3 {
              font-size: 1.5rem;
              font-weight: 600;
              color: #1e3a4b;
              margin-top: 2rem;
              margin-bottom: 1rem;
              line-height: 1.4;
            }
            
            .article-content p {
              font-size: 1.125rem;
              line-height: 1.7;
              color: #1e3a4b;
              margin-bottom: 1.5rem;
              text-align: justify;
            }
            
            .article-content ul {
              margin: 1.5rem 0;
              padding-left: 1.5rem;
            }
            
            .article-content li {
              font-size: 1.125rem;
              line-height: 1.7;
              color: #1e3a4b;
              margin-bottom: 0.5rem;
              list-style-type: disc;
            }
            
            .article-content h2:first-child {
              margin-top: 0;
            }
            
            .article-content h3:last-child {
              background: linear-gradient(135deg, #00d8e8 0%, #00c4d4 100%);
              color: white;
              padding: 1rem;
              border-radius: 0.5rem;
              margin-top: 2rem;
              font-size: 1.125rem;
              font-weight: 600;
              text-align: center;
              border: none;
            }
          `}</style>
          <div 
            className="article-content"
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
            <button className="flex items-center gap-2 px-4 py-2 bg-[#00d8e8] text-white rounded-lg hover:bg-[#00c4d4] transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Share on LinkedIn
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Share on X
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}