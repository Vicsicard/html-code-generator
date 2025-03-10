import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Initialize Supabase server client (not using auth helpers since this is a webhook)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Fallback to anon key if service role key is not available
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        
        // Get user ID from metadata
        const userId = session.metadata.user_id
        
        if (!userId) {
          console.error('No user_id in session metadata')
          break
        }
        
        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        
        // Calculate subscription end date (30 days from now)
        const subscriptionEndDate = new Date()
        subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30)
        
        // Update user metadata with subscription details
        await supabase.from('user_metadata').upsert({
          user_id: userId,
          subscription_id: subscription.id,
          subscription_status: 'active',
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: subscriptionEndDate.toISOString(),
          stripe_customer_id: session.customer,
        }, { onConflict: 'user_id' })
        
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        
        // Only process subscription invoices
        if (invoice.subscription) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
          
          // Get customer ID
          const customerId = invoice.customer
          
          // Find user with this customer ID
          const { data: userData, error } = await supabase
            .from('user_metadata')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .single()
          
          if (error || !userData) {
            console.error('Could not find user with customer ID:', customerId)
            break
          }
          
          // Calculate new subscription end date (30 days from now)
          const subscriptionEndDate = new Date()
          subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30)
          
          // Update subscription information
          await supabase.from('user_metadata').update({
            subscription_status: 'active',
            subscription_start_date: new Date().toISOString(),
            subscription_end_date: subscriptionEndDate.toISOString(),
          }).eq('user_id', userData.user_id)
        }
        
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        // Get customer ID
        const customerId = subscription.customer
        
        // Find user with this customer ID
        const { data: userData, error } = await supabase
          .from('user_metadata')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()
        
        if (error || !userData) {
          console.error('Could not find user with customer ID:', customerId)
          break
        }
        
        // Update subscription status
        await supabase.from('user_metadata').update({
          subscription_status: 'canceled',
        }).eq('user_id', userData.user_id)
        
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
