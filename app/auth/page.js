'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/authContext'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const handleAuth = async (data) => {
    setLoading(true)
    setError('')
    
    try {
      let result
      
      if (isLogin) {
        result = await signIn(data.email, data.password)
      } else {
        result = await signUp(data.email, data.password)
      }
      
      if (!result.success) {
        throw new Error(result.error.message || 'Authentication failed')
      }
      
      // Navigate to workspace on success
      router.push('/workspace')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await signInWithGoogle()
      if (!result.success) {
        throw new Error('Google sign in failed')
      }
      // The redirect is handled by Supabase OAuth
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="bg-[#1E4B8F] w-full max-w-md p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          {isLogin ? 'Log In' : 'Sign Up'}
        </h1>
        
        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(handleAuth)} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className="w-full p-2 rounded border bg-[#0C2340] text-white border-gray-700"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-white mb-1">Password</label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className="w-full p-2 rounded border bg-[#0C2340] text-white border-gray-700"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-[#F47920] w-full py-2 rounded text-white font-bold uppercase hover:bg-[#D96510] transition-all"
          >
            {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="bg-[#7B4F39] w-full py-2 rounded text-white font-bold uppercase hover:bg-[#5F3928] transition-all"
          >
            {loading ? 'Processing...' : 'Continue with Google'}
          </button>
        </div>
        
        <div className="mt-6 text-center text-white">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-[#F47920] hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-[#F47920] hover:underline"
              >
                Log In
              </button>
            </p>
          )}
        </div>
        
        <div className="mt-8 text-center text-white">
          <p className="text-sm">
            Free trial gives you 1 hour of access.
          </p>
          <p className="text-sm mt-1">
            For unlimited access, subscribe for just $19.99/month.
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <Link href="/pricing" className="text-[#F47920] hover:underline text-sm">
            View pricing details
          </Link>
        </div>
      </div>
    </div>
  )
}
