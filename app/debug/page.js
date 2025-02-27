'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function DebugPage() {
  const [status, setStatus] = useState('Loading...')
  const [envVars, setEnvVars] = useState({})
  const [testResult, setTestResult] = useState(null)

  useEffect(() => {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setEnvVars({
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      supabaseUrl: supabaseUrl,
    })

    // Set status based on environment variables
    if (!supabaseUrl || !supabaseKey) {
      setStatus('Missing Supabase environment variables')
      return
    }

    // Initialize Supabase client
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      setStatus('Supabase client initialized')
      
      // Test supabase connection
      testConnection(supabase)
    } catch (error) {
      setStatus(`Error initializing Supabase: ${error.message}`)
    }
  }, [])

  // Test Supabase connection
  const testConnection = async (supabase) => {
    try {
      const { data, error } = await supabase.from('user_metadata').select('count(*)', { count: 'exact' })
      
      if (error) {
        setTestResult({
          success: false,
          message: `Database query error: ${error.message}`,
          error
        })
        return
      }
      
      setTestResult({
        success: true,
        message: 'Successfully connected to Supabase',
        data
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection test error: ${error.message}`,
        error
      })
    }
  }

  // Test login function
  const testLogin = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        setTestResult({
          success: false,
          message: 'Missing Supabase credentials'
        })
        return
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      // Test with a fake login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword',
      })
      
      if (error) {
        setTestResult({
          success: false,
          message: `Login test error: ${error.message}`,
          error
        })
        return
      }
      
      setTestResult({
        success: true,
        message: 'Login test successful',
        data
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: `Login test error: ${error.message}`,
        error
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Debug Page</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        <p>{status}</p>
      </div>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>
      
      <div className="mb-6">
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Test Login
        </button>
      </div>
      
      {testResult && (
        <div className={`p-4 border rounded ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <h2 className="text-xl font-semibold mb-2">Test Result</h2>
          <p className="font-semibold">{testResult.message}</p>
          {testResult.error && (
            <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-auto">
              {JSON.stringify(testResult.error, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
