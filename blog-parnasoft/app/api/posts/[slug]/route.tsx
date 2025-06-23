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

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const result = await makeRequest(`/posts/${encodeURIComponent(params.slug)}`)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json()
    const result = await makeRequest(`/posts/${encodeURIComponent(params.slug)}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await makeRequest(`/posts/${encodeURIComponent(params.slug)}`, {
      method: 'DELETE'
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}