//posts route - app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.FUNCTION_KEY

async function makeRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-functions-key': API_KEY!,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`)
  }

  return response.json()
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userType = searchParams.get('userType')
    
    const queryParam = userType && userType !== 'anonymous' ? `?userType=${userType}` : ''
    const result = await makeRequest(`/posts${queryParam}`)
    
    return NextResponse.json(Array.isArray(result) ? result : [])
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await makeRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(body)
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}