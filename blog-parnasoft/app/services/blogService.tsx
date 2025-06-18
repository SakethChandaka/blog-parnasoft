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

// services/blogService.ts
class BlogService {
  private static instance: BlogService
  private posts: BlogPost[] = []

  private constructor() {
    this.loadPosts()
  }

  public static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService()
    }
    return BlogService.instance
  }

  private loadPosts(): void {
    // In future, this will call your Azure Function
    // For now, hardcoded data with new structure
    this.posts = [
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
        author: "Managing Director, Parnasoft",
        publishedAt: "2025-06-15",
        readTime: "8 min read",
        tags: ["AI", "Development", "Future Tech", "Automation"],
        authorType: 'md',
        slug: "future-of-ai-in-software-development",
        visibility: 'public',
        featured: true
      },
      // Add placeholder structure for other posts
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
        category: "AI & Technology",
        author: "Managing Director, Parnasoft",
        publishedAt: "2025-06-15",
        readTime: "8 min read",
        tags: ["AI", "Development", "Future Tech", "Automation"],
        authorType: 'md',
        slug: "the-scaling-imperative",
        visibility: 'public',
        featured: true
    },
    ]
  }

  // Future: This will call Azure Function
  async getAllPosts(filters?: BlogFilters): Promise<BlogPost[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let filteredPosts = [...this.posts]

    if (filters?.visibility) {
      filteredPosts = filteredPosts.filter(post => post.visibility === filters.visibility)
    }

    if (filters?.featured !== undefined) {
      filteredPosts = filteredPosts.filter(post => post.featured === filters.featured)
    }

    if (filters?.category) {
      filteredPosts = filteredPosts.filter(post => post.category === filters.category)
    }

    if (filters?.authorType) {
      filteredPosts = filteredPosts.filter(post => post.authorType === filters.authorType)
    }

    // Sort by date, newest first
    return filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }

  // Future: This will call Azure Function
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return this.posts.find(post => post.slug === slug) || null
  }

  // Helper method to get posts based on user access level
  async getPostsForUser(userType: 'anonymous' | 'internal' | 'admin' = 'anonymous'): Promise<BlogPost[]> {
    let allowedVisibilities: ('public' | 'internal' | 'restricted')[] = []
    
    switch (userType) {
      case 'anonymous':
        allowedVisibilities = ['public']
        break
      case 'internal':
        allowedVisibilities = ['public', 'internal']
        break
      case 'admin':
        allowedVisibilities = ['public', 'internal', 'restricted']
        break
    }

    const allPosts = await this.getAllPosts()
    return allPosts.filter(post => allowedVisibilities.includes(post.visibility))
  }

  // Get categories available to user
  async getAvailableCategories(userType: 'anonymous' | 'internal' | 'admin' = 'anonymous'): Promise<string[]> {
    const posts = await this.getPostsForUser(userType)
    const categories = [...new Set(posts.map(post => post.category))]
    return categories.sort()
  }

  // Get featured posts for homepage
  async getFeaturedPosts(userType: 'anonymous' | 'internal' | 'admin' = 'anonymous'): Promise<BlogPost[]> {
    const posts = await this.getPostsForUser(userType)
    return posts.filter(post => post.featured === true)
  }
}

// Export singleton instance
export const blogService = BlogService.getInstance()

// Utility functions
export const getBadgeInfo = (authorType: string) => {
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

export const getVisibilityBadge = (visibility: string) => {
  switch (visibility) {
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
    case 'public':
    default:
      return {
        text: 'PUBLIC',
        className: 'bg-green-100 text-green-800 border-green-200'
      }
  }
}