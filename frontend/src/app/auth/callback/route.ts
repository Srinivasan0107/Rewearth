import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
    }

    if (session?.user) {
      const { user } = session
      const username = user.email?.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '') || `user_${Date.now()}`
      
      try {
        // Create or update user in backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supabase_auth_id: user.id,
            email: user.email,
            username,
            avatar_url: user.user_metadata?.avatar_url || null,
            bio: null,
          }),
        })

        if (!response.ok && response.status !== 400) {
          console.error('User sync failed:', await response.text())
        }
      } catch (e) {
        console.error('User sync error:', e)
      }
    }
  }

  return NextResponse.redirect(new URL('/marketplace', request.url))
}
