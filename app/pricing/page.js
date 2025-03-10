'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/authContext'
import Link from 'next/link'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/auth')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0C2340] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-6 text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Free Trial Card */}
          <div className="bg-[#1E4B8F] rounded-xl p-8 w-full md:w-1/2 flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Free Trial</h2>
            <p className="text-3xl font-bold mb-6">$0</p>
            
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#F47920] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>1 hour of access</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#F47920] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>AI-powered HTML generation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#F47920] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Live preview</span>
              </li>
              <li className="flex items-start opacity-50">
                <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Limited time only</span>
              </li>
            </ul>
            
            <Link 
              href="/workspace" 
              className="bg-[#7B4F39] text-white text-center py-3 rounded font-bold uppercase hover:bg-[#5F3928] transition-all"
            >
              Try for free
            </Link>
          </div>

          {/* Pro Plan Card */}
          <div className="bg-[#1E4B8F] rounded-xl p-8 w-full md:w-1/2 flex flex-col border-2 border-[#F47920] relative">
            <div className="absolute top-0 right-0 bg-[#F47920] text-white px-4 py-1 rounded-bl-lg rounded-tr-lg font-bold">
              RECOMMENDED
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Pro Plan</h2>
            <p className="text-3xl font-bold mb-1">$19.99<span className="text-lg font-normal">/month</span></p>
            <p className="text-sm mb-6 text-gray-300">Billed monthly, cancel anytime</p>
            
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#F47920] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited access</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#F47920] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced AI-powered HTML generation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#F47920] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Live preview & editing</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#F47920] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Priority support</span>
              </li>
            </ul>
            
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="bg-[#F47920] text-white py-3 rounded font-bold uppercase hover:bg-[#D96510] transition-all"
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-[#F47920] hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
