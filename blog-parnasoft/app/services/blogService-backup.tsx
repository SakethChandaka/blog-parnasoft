// app/services/blogService.ts
import { BlogPost, UserType, AuthorType, Visibility } from '../types/blog'

// Hardcoded sample data (later this will come from Azure Functions)
const sampleBlogPosts: BlogPost[] = [
  {
    id: 1, // Using number as in your original
    title: 'The Future of AI-Driven Development at Parnasoft',
    slug: 'future-ai-driven-development-parnasoft',
    excerpt: 'Explore how artificial intelligence is revolutionizing software development practices and what it means for the future of technology at Parnasoft.',
    content: `
      <h2>Introduction to AI-Driven Development</h2>
      <p>Artificial Intelligence is transforming the landscape of software development in unprecedented ways. At Parnasoft, we're at the forefront of this revolution, implementing cutting-edge AI tools and methodologies that enhance our development processes and deliver superior results for our clients.</p>
      
      <h2>Key Areas of AI Integration</h2>
      <p>Our approach to AI-driven development focuses on several critical areas:</p>
      <ul>
        <li>Automated code generation and optimization</li>
        <li>Intelligent testing and quality assurance</li>
        <li>Predictive analytics for project management</li>
        <li>Enhanced user experience through machine learning</li>
      </ul>
      
      <h2>Real-World Applications</h2>
      <p>We've successfully implemented AI solutions across various client projects, resulting in 40% faster development cycles and 60% reduction in bugs. Our AI-powered tools help developers focus on creative problem-solving while automating routine tasks.</p>
      
      <h3>The future of development is here, and Parnasoft is leading the way!</h3>
    `,
    author: 'Parnasoft',
    authorType: 'general', // Using 'general' as in your original
    category: 'AI & Technology',
    tags: ['AI', 'Development', 'Innovation', 'Future Tech', 'Automation'],
    publishedAt: '2024-12-15T10:00:00Z',
    readTime: '8 min read',
    visibility: 'public',
    featured: true
  },
  {
    id: 2,
    title: "The Scaling Imperative",
    excerpt: "A comprehensive guide to designing and implementing microservices that can handle enterprise-level traffic and complexity while maintaining reliability.",
    content: `
      <h2>Why Building for Tomorrow Defines Success in Software and Business</h2>
      <p>In the technology industry, there's a fundamental truth that separates lasting success from temporary wins: the ability to build with scale in mind from day one. This principle applies equally to software development and business operations, and understanding this connection has become critical for any organization seeking real growth.</p>
      
      <h2>The Reality Check: Easy vs. Scalable</h2>
      <p>Anyone can build software today. The internet is full of tutorials, there are tools that practically write code for you, and frameworks handle most of the heavy lifting. You can get an app running over a weekend. Similarly, anyone can start a small business and manage a few employees.</p>
      <p>But here's where things get interesting – building something that works and building something that scales are completely different challenges. It's like the difference between cooking for your family and running a restaurant kitchen during rush hour. The basic skills might overlap, but the planning, systems, and strategic thinking required are worlds apart.</p>
      <p>This misconception creates a dangerous blind spot. Many entrepreneurs and developers think they understand the full scope of their challenge when they've only scratched the surface.</p>
      
      <h2>Business Scaling: The Same Challenge in Different Clothes</h2>
      <p>Running a business follows the same pattern. Managing five people requires different skills than leading fifty, just as a ten-user application needs different architecture than a ten-thousand-user platform.</p>
      <p>Anyone can handle a small team where everyone knows each other and communication happens naturally. But successful business scaling requires systematic thinking about processes, communication structures, decision-making frameworks, and how to preserve company culture during rapid growth.</p>
      <p>The hard part is building systems that work without you being directly involved in every decision. Many business owners struggle with this because it means giving up the hands-on control that got them started.</p>
      
      <h2>The Parnasoft Approach: Thinking Three Steps Ahead</h2>
      <p>Throughout Parnasoft's growth, one principle has guided both client software development and internal business operations: every decision must consider not just what's needed today, but what will be needed tomorrow. This methodology has proven essential in delivering software solutions that stay strong and efficient as client businesses expand.</p>
      <p>When working with clients, the focus goes beyond immediate technical requirements to understand the bigger picture. Where does the client want their business to be in three years? That answer directly influences the architectural decisions made today. This approach has consistently prevented the expensive rebuilds that hit companies who focus only on immediate needs.</p>
      <p>The same thinking shapes internal decisions at Parnasoft. Instead of just filling today's gaps, hiring and process decisions consider what the company will need as it takes on larger projects and serves more demanding clients.</p>
      
      <h2>The Technical Reality: Why Scale Matters</h2>
      <p>Scalable software involves complex technical considerations that users never see but that determine whether systems survive growth. Database optimization, caching strategies, load balancing, microservices architecture, API design, and security protocols all require expert-level implementation to handle exponential growth effectively.</p>
      <p>Here's the brutal truth: these technical requirements can't be added to existing systems as an afterthought. The cost and complexity of rebuilding functional but non-scalable software often costs more than starting over completely.</p>

      <h2>Strategic Business Architecture: Building Systems That Work</h2>
      <p>Business scaling demands similar strategic architecture. Organizational structures, communication methods, performance management systems, and decision-making processes must be designed for growth, not just current operations.</p>
      <p>Companies that skip this step frequently hit what experts call "complexity collapse" – the point where adding more people or customers actually makes the organization less effective, not more effective.</p>

      <h2>The Investment Reality: Paying Now vs. Paying Later</h2>
      <p>Both scalable software and scalable business operations require upfront investments that seem unnecessary for current needs. This creates a tough situation where leaders must spend money on problems they haven't encountered yet.</p>
      <p>However, industry experience shows the same pattern repeatedly: implementing scalable solutions from the beginning costs substantially less than rebuilding when growth exceeds system capabilities. This applies whether you're talking about database architecture or management structures.</p>

      <h2>What Separates the Professionals from Everyone Else</h2>
      <p>What distinguishes professional software developers from casual programmers is the ability to solve problems that don't exist yet. Professional developers build systems that perform better as load increases, accommodate new features without major changes, and remain maintainable as development teams expand.</p>
      <p>The same principle applies to business leadership. What separates successful business leaders from small-scale managers is creating organizational systems that become more effective as they scale, rather than more chaotic.</p>
      <p>Anyone can manage what they can see and control directly. The real skill is building systems that work when you're not in the room.</p>

      <h2>The Competitive Edge in Today's Market</h2>
      <p>In today's fast-moving business environment, the companies that achieve sustainable competitive advantage are those with the technical infrastructure and organizational capability to adapt quickly when markets change. This adaptability depends entirely on having scalable foundations in place before growth demands them.</p>
      <p>Parnasoft's continued success and client achievements reflect the practical application of these principles. By consistently choosing scalable solutions over quick fixes – both in client software development and internal business operations – sustainable growth becomes achievable rather than accidental.</p>

      <h2>The Bottom Line</h2>
      <p>The difference between functional systems and scalable systems – whether in software or business – represents the gap between temporary success and lasting achievement. Building for scale requires expertise, strategic thinking, and investment that extend beyond immediate requirements.</p>
      <p>Organizations that embrace this principle position themselves for growth that strengthens their foundations rather than straining them. Those that don't inevitably face the expensive and disruptive process of rebuilding what should have been built correctly from the start. The choice is simple: build for today and rebuild tomorrow, or build for tomorrow and grow confidently today.</p>
      <h3>Parnasoft specializes in developing scalable software solutions and organizational systems that grow stronger with expansion. Our expertise in both technical architecture and business scaling ensures that your investments today support your ambitions tomorrow.</h3>
    `,
      category: "Architecture",
      author: "Managing Director, Parnasoft",
      publishedAt: "2025-06-15",
      readTime: "15 min read",
      tags: ["Architecture", "Development", "Future Tech", "Guide"],
      authorType: 'md',
      slug: "the-scaling-imperative",
      visibility: 'public',
      featured: true
  },
  {
    id: 3,
    title: 'URGENT: New Security Protocols Effective Immediately',
    slug: 'urgent-new-security-protocols-effective-immediately',
    excerpt: 'Important security updates and new protocols that all team members must implement immediately to ensure data protection and compliance.',
    content: `
      <h2>Immediate Action Required</h2>
      <p>Effective immediately, all Parnasoft team members must implement the following security protocols to ensure our continued compliance with international data protection standards.</p>
      
      <h2>New Security Measures</h2>
      <p>The following measures are now mandatory for all personnel:</p>
      <ul>
        <li>Multi-factor authentication on all company accounts</li>
        <li>Weekly security training completion</li>
        <li>Encrypted communication for all client interactions</li>
        <li>Regular password updates every 30 days</li>
      </ul>
      
      <h2>Compliance Deadline</h2>
      <p>All team members must complete the implementation of these security measures by January 15, 2025. Failure to comply may result in temporary system access restrictions.</p>
      
      <h2>Support and Training</h2>
      <p>Our IT security team is available 24/7 to assist with implementation. Please contact security@parnasoft.com for immediate support.</p>
      
      <h3>Your compliance ensures our collective security. Act now!</h3>
    `,
    author: 'IT Security Team',
    authorType: 'notice',
    category: 'Security',
    tags: ['Security', 'Compliance', 'Urgent', 'Protocols', 'IT'],
    publishedAt: '2024-12-20T14:30:00Z',
    readTime: '5 min read',
    visibility: 'restricted',
    featured: false
  }
]

// Simulated data store (in production, this would be your database/API)
let blogPostsStore: BlogPost[] = [...sampleBlogPosts]

export const blogService = {
  // Get featured posts based on user access level
  getFeaturedPosts: async (userType: UserType): Promise<BlogPost[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return blogPostsStore.filter(post => {
      switch (userType) {
        case 'admin':
          return true // Admin can see all posts
        case 'internal':
          return post.visibility === 'public' || post.visibility === 'internal'
        case 'anonymous':
        default:
          return post.visibility === 'public'
      }
    }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  },

  // Get all posts (admin only)
  getAllPosts: async (): Promise<BlogPost[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [...blogPostsStore].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  },

  // Get a single post by slug
  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return blogPostsStore.find(post => post.slug === slug) || null
  },

  // Create a new post (admin only)
  createPost: async (postData: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newPost: BlogPost = {
      ...postData,
      id: Math.max(...blogPostsStore.map(p => p.id)) + 1, // Auto-increment ID
      publishedAt: new Date().toISOString()
    }
    
    blogPostsStore.push(newPost)
    return newPost
  },

  // Update an existing post (admin only)
  updatePost: async (post: BlogPost): Promise<BlogPost> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const index = blogPostsStore.findIndex(p => p.id === post.id)
    if (index === -1) {
      throw new Error('Post not found')
    }
    
    blogPostsStore[index] = post
    return post
  },

  // Delete a post (admin only)
  deletePost: async (postId: number): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = blogPostsStore.findIndex(p => p.id === postId)
    if (index === -1) {
      throw new Error('Post not found')
    }
    
    blogPostsStore.splice(index, 1)
  },

  // Search posts
  searchPosts: async (query: string, userType: UserType): Promise<BlogPost[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const accessiblePosts = await blogService.getFeaturedPosts(userType)
    
    return accessiblePosts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }
}

// Helper function to get badge information for author types
export const getBadgeInfo = (authorType: AuthorType) => {
  switch (authorType) {
    case 'md':
      return {
        text: 'MD INSIGHT',
        icon: '👑',
        gradient: 'from-[#ff6b35] to-[#f7931e]'
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
        text: 'ARTICLE',
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