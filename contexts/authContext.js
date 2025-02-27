'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a Supabase client with proper error handling
let supabase = null
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey)
    console.log('Supabase client initialized with URL:', supabaseUrl)
  } else {
    console.warn('Missing Supabase credentials:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseKey 
    })
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error)
}

// Create auth context
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [envVarsReady, setEnvVarsReady] = useState(!!supabase)

  useEffect(() => {
    // Check if Supabase client is available
    if (!supabase) {
      setLoading(false)
      console.warn('Supabase environment variables are not configured.')
      return
    }

    // Check for active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setUser(session?.user || null)
            setLoading(false)
          }
        )

        return () => {
          subscription?.unsubscribe()
        }
      } catch (error) {
        console.error('Auth error:', error)
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  // Check if free trial is expired (1 hour limit)
  const checkFreeTrialStatus = async () => {
    if (!user || !supabase) return { isExpired: true }
    
    try {
      const { data, error } = await supabase
        .from('user_metadata')
        .select('login_timestamp, subscription_status')
        .eq('user_id', user.id)
        .single()
      
      if (error) throw error

      // If user has an active subscription, they're not limited by trial
      if (data?.subscription_status === 'active') {
        return { isExpired: false }
      }

      const loginTime = new Date(data?.login_timestamp || user.created_at).getTime()
      const currentTime = new Date().getTime()
      const hoursPassed = (currentTime - loginTime) / (1000 * 60 * 60)
      
      return { 
        isExpired: hoursPassed > 1,
        hoursPassed 
      }
    } catch (error) {
      console.error('Error checking trial status:', error)
      return { isExpired: true, error }
    }
  }

  // Login with email and password
  const signIn = async (email, password) => {
    if (!supabase) {
      console.error('Supabase client not initialized. Check your environment variables.')
      return { error: 'Supabase client not initialized' }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      // Store login timestamp
      await supabase.from('user_metadata').upsert({
        user_id: data.user.id,
        login_timestamp: new Date().toISOString(),
      })
      
      return { success: true, data }
    } catch (error) {
      return { success: false, error }
    }
  }

  // Login with Google
  const signInWithGoogle = async () => {
    if (!supabase) {
      console.error('Supabase client not initialized. Check your environment variables.')
      return { error: 'Supabase client not initialized' }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      return { success: false, error }
    }
  }

  // Register with email and password
  const signUp = async (email, password) => {
    if (!supabase) {
      console.error('Supabase client not initialized. Check your environment variables.')
      return { error: 'Supabase client not initialized' }
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      
      // Store login timestamp
      if (data.user) {
        await supabase.from('user_metadata').insert({
          user_id: data.user.id,
          login_timestamp: new Date().toISOString(),
        })
      }
      
      return { success: true, data }
    } catch (error) {
      return { success: false, error }
    }
  }

  // Sign out
  const signOut = async () => {
    if (!supabase) return { error: 'Supabase client not initialized' }
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const value = {
    user,
    loading,
    envVarsReady,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    checkFreeTrialStatus,
    supabase
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
