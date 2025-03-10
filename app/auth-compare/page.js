'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '../../contexts/authContext'

export default function AuthComparisonPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({})
  const { signIn } = useAuth() // From your auth context
  
  // Direct credentials for testing
  const testEmail = 'test@example.com'
  const testPassword = 'Test123456!'
  
  // Get Supabase environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Test method 1: Direct Supabase client
  const testDirectSupabase = async () => {
    setLoading(true)
    try {
      // Create direct client
      const directClient = createClient(supabaseUrl, supabaseKey)
      
      // Try login
      const { data, error } = await directClient.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })
      
      setResults(prev => ({
        ...prev,
        directClient: {
          success: !error,
          message: error ? `Error: ${error.message}` : 'Success!',
          data: data || null,
          error: error || null
        }
      }))
    } catch (err) {
      setResults(prev => ({
        ...prev,
        directClient: {
          success: false,
          message: `Exception: ${err.message}`,
          error: err
        }
      }))
    } finally {
      setLoading(false)
    }
  }
  
  // Test method 2: Auth context from your app
  const testAuthContext = async () => {
    setLoading(true)
    try {
      const result = await signIn(testEmail, testPassword)
      
      setResults(prev => ({
        ...prev,
        authContext: {
          success: result.success,
          message: result.success ? 'Success!' : `Error: ${result.error?.message || 'Unknown error'}`,
          data: result.data || null,
          error: result.error || null
        }
      }))
    } catch (err) {
      setResults(prev => ({
        ...prev,
        authContext: {
          success: false,
          message: `Exception: ${err.message}`,
          error: err
        }
      }))
    } finally {
      setLoading(false)
    }
  }
  
  // Test method 3: Recreated auth logic
  const testRecreatedMethod = async () => {
    setLoading(true)
    try {
      // Create client
      const recreatedClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true
        }
      })
      
      // Try login with exact same approach as in context
      const { data, error } = await recreatedClient.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      })
      
      setResults(prev => ({
        ...prev,
        recreatedMethod: {
          success: !error,
          message: error ? `Error: ${error.message}` : 'Success!',
          data: data || null,
          error: error || null,
          envVars: {
            url: supabaseUrl?.substring(0, 10) + '...',
            key: supabaseKey?.substring(0, 5) + '...',
          }
        }
      }))
    } catch (err) {
      setResults(prev => ({
        ...prev,
        recreatedMethod: {
          success: false,
          message: `Exception: ${err.message}`,
          error: err,
          envVars: {
            url: supabaseUrl?.substring(0, 10) + '...',
            key: supabaseKey?.substring(0, 5) + '...',
          }
        }
      }))
    } finally {
      setLoading(false)
    }
  }
  
  const runAllTests = async () => {
    setResults({})
    await testDirectSupabase()
    await testAuthContext()
    await testRecreatedMethod()
  }
  
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Authentication Debugging Tool</h1>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={testDirectSupabase}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Test Direct Supabase
        </button>
        
        <button
          onClick={testAuthContext}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Test Auth Context
        </button>
        
        <button
          onClick={testRecreatedMethod}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
        >
          Test Recreated Method
        </button>
        
        <button
          onClick={runAllTests}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Run All Tests
        </button>
      </div>
      
      {loading && <p className="mb-4">Loading...</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.directClient && (
          <div className={`p-4 rounded ${results.directClient.success ? 'bg-blue-100' : 'bg-red-100'}`}>
            <h2 className="text-lg font-bold">Direct Supabase</h2>
            <p className="font-bold">{results.directClient.message}</p>
            {results.directClient.success && (
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(results.directClient.data, null, 2)}
              </pre>
            )}
          </div>
        )}
        
        {results.authContext && (
          <div className={`p-4 rounded ${results.authContext.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <h2 className="text-lg font-bold">Auth Context</h2>
            <p className="font-bold">{results.authContext.message}</p>
            {results.authContext.success && (
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(results.authContext.data, null, 2)}
              </pre>
            )}
          </div>
        )}
        
        {results.recreatedMethod && (
          <div className={`p-4 rounded ${results.recreatedMethod.success ? 'bg-purple-100' : 'bg-red-100'}`}>
            <h2 className="text-lg font-bold">Recreated Method</h2>
            <p className="font-bold">{results.recreatedMethod.message}</p>
            <div className="mt-2 text-xs">
              <p>Env variables (partial):</p>
              <pre className="bg-white p-2 rounded">
                {JSON.stringify(results.recreatedMethod.envVars, null, 2)}
              </pre>
            </div>
            {results.recreatedMethod.success && (
              <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(results.recreatedMethod.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Test User Credentials</h2>
        <p><strong>Email:</strong> {testEmail}</p>
        <p><strong>Password:</strong> {testPassword}</p>
      </div>
    </div>
  )
}
