import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  
  const path = req.nextUrl.pathname

  // Protect workspace route
  if (path === '/workspace' || path.startsWith('/api/')) {
    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    // User is authenticated, now check subscription or trial status
    const { data, error } = await supabase
      .from('user_metadata')
      .select('login_timestamp, subscription_status, subscription_end_date')
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      console.error('Error fetching user metadata:', error)
      // Continue as free trial user if we can't fetch metadata
    } else {
      // Check if user has an active subscription
      if (data?.subscription_status === 'active') {
        // Has active subscription, check if within 30-day window
        if (data.subscription_end_date) {
          const endDate = new Date(data.subscription_end_date)
          if (endDate < new Date()) {
            // Subscription has expired, redirect to renewal page
            return NextResponse.redirect(new URL('/pricing', req.url))
          }
        }
      } else {
        // Free trial user, check if trial has expired (1 hour)
        const loginTime = new Date(data?.login_timestamp || session.user.created_at).getTime()
        const currentTime = new Date().getTime()
        const hoursPassed = (currentTime - loginTime) / (1000 * 60 * 60)
        
        if (hoursPassed > 1) {
          // Trial expired, redirect to pricing page
          return NextResponse.redirect(new URL('/pricing', req.url))
        }
      }
    }
  }

  return res
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/workspace',
    '/api/:path*',
    '/auth/callback'
  ],
}
