import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    
    // Store login timestamp for new users
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.from('user_metadata').upsert({
        user_id: session.user.id,
        login_timestamp: new Date().toISOString(),
      }, { onConflict: 'user_id' })
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/workspace', req.url))
}
