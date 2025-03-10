import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  console.log('[auth/check API] Request received');
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('[auth/check API] Not authenticated');
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    console.log('[auth/check API] Authenticated as user:', session.user.email);
    return NextResponse.json({ 
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email
      }
    }, { status: 200 });
  } catch (error) {
    console.error('[auth/check API] Error checking authentication:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
