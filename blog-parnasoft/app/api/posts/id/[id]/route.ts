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

export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    
    const result = await makeRequest(`/posts/id/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating post by ID:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const result = await makeRequest(`/posts/id/${id}`)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching post by ID:', error)
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
}

export async function DELETE(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await makeRequest(`/posts/id/${id}`, {
      method: 'DELETE'
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post by ID:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}