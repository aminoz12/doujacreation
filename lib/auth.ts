import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours
const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days

function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function login(username: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; error?: string }> {
  try {
    // Get admin by username
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('username', username)
      .single()

    if (adminError || !admin) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)
    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Create session
    const token = generateToken()
    const expiresAt = new Date(Date.now() + (rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION))

    const { error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .insert({
        admin_id: admin.id,
        token,
        expires_at: expiresAt.toISOString(),
        remember_me: rememberMe
      })

    if (sessionError) {
      console.error('Session creation error:', sessionError)
      return { success: false, error: 'Failed to create session' }
    }

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    })

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (token) {
      // Delete session from database
      await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('token', token)

      // Delete cookie
      cookieStore.delete(SESSION_COOKIE_NAME)
    }
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export async function getSession(): Promise<{ admin_id: string; username: string } | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
      return null
    }

    // Get session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .select('*, admins(id, username)')
      .eq('token', token)
      .single()

    if (sessionError || !session) {
      return null
    }

    // Check if expired
    if (new Date(session.expires_at) < new Date()) {
      await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('token', token)
      return null
    }

    const admin = session.admins as { id: string; username: string }
    return {
      admin_id: admin.id,
      username: admin.username
    }
  } catch (error) {
    console.error('Get session error:', error)
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}







