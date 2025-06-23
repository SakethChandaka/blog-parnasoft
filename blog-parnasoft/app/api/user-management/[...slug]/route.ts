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

  if (response.status === 204) {
    return null
  }

  return response.json()
}

// Fix parameter typing:
export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params
    const endpoint = `/user-management/${slug.join('/')}`
    const result = await makeRequest(endpoint)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in user management GET:', error)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest, 
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params
    const body = await request.json()
    const endpoint = `/user-management/${slug.join('/')}`
    const result = await makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    })
    
    return NextResponse.json(result || { success: true })
  } catch (error) {
    console.error('Error in user management POST:', error)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params
    const body = await request.json()
    const endpoint = `/user-management/${slug.join('/')}`
    const result = await makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in user management PUT:', error)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params
    const endpoint = `/user-management/${slug.join('/')}`
    await makeRequest(endpoint, { method: 'DELETE' })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in user management DELETE:', error)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}