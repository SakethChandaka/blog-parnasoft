import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL
const API_KEY = process.env.FUNCTION_KEY

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'x-functions-key': API_KEY!,
      },
    })

    return NextResponse.json({ valid: response.ok })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}