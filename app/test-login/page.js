'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function TestLoginPage() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('Test123456!')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials')
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      // Try the login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        throw error
      }
      
      setResult({
        success: true,
        message: 'Login successful!',
        user: data.user
      })
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error.message}`,
        error
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Simple Login Test</h1>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className="font-semibold">{result.message}</p>
          {result.success && (
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(result.user, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
