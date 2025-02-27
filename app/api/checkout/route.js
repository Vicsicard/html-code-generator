import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to create a checkout session' },
        { status: 401 }
      )
    }
    
    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Monthly subscription price ID from Stripe
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: {
        user_id: session.user.id,
      },
    })
    
    // Save Stripe session ID to Supabase
    const { error } = await supabase
      .from('user_metadata')
      .upsert({
        user_id: session.user.id,
        stripe_session_id: stripeSession.id,
      }, { onConflict: 'user_id' })
    
    if (error) {
      console.error('Error saving stripe session:', error)
    }
    
    // Return the checkout URL
    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating checkout session' },
      { status: 500 }
    )
  }
}
