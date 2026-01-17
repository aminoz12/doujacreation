import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    
    if (session) {
      return NextResponse.json({ 
        authenticated: true, 
        username: session.username 
      })
    } else {
      return NextResponse.json({ authenticated: false })
    }
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json(
      { authenticated: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}



