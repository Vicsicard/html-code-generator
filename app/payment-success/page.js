'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to workspace after 5 seconds
    const timer = setTimeout(() => {
      router.push('/workspace')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-[#0C2340] text-white flex flex-col items-center justify-center p-4">
      <div className="bg-[#1E4B8F] rounded-xl p-8 max-w-md w-full text-center">
        <div className="bg-green-500 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
          <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        
        <p className="mb-6">
          Thank you for subscribing to HTML Code Creator Pro! You now have unlimited access to all our features.
        </p>
        
        <p className="mb-8 text-sm text-gray-300">
          You will be redirected to the workspace in a few seconds...
        </p>
        
        <Link 
          href="/workspace" 
          className="bg-[#F47920] text-white py-2 px-6 rounded font-bold hover:bg-[#D96510] transition-all inline-block"
        >
          Go to Workspace Now
        </Link>
      </div>
    </div>
  )
}
