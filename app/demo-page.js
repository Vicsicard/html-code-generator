'use client'

import Link from 'next/link'

export default function DemoHome() {
  return (
    <div className="min-h-screen bg-[#0C2340] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">HTML Code Creator</h1>
        <p className="text-xl md:text-2xl text-center max-w-3xl mb-12">
          Effortlessly create beautiful, responsive HTML code with the power of AI
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="/auth"
            className="bg-[#F47920] text-white px-8 py-3 rounded-lg text-lg font-bold uppercase hover:bg-[#D96510] transition-all"
          >
            Try it Free
          </Link>
          
          <Link
            href="/pricing"
            className="bg-[#7B4F39] text-white px-8 py-3 rounded-lg text-lg font-bold uppercase hover:bg-[#5F3928] transition-all"
          >
            View Pricing
          </Link>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-[#1E4B8F] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#0C2340] p-6 rounded-xl">
              <div className="w-16 h-16 bg-[#F47920] rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Describe Your Idea</h3>
              <p className="text-center">
                Simply tell our AI what you want to create using natural language.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-[#0C2340] p-6 rounded-xl">
              <div className="w-16 h-16 bg-[#F47920] rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Get Instant Code</h3>
              <p className="text-center">
                Our AI generates clean, optimized HTML, CSS, and JavaScript code for your project.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-[#0C2340] p-6 rounded-xl">
              <div className="w-16 h-16 bg-[#F47920] rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Refine & Preview</h3>
              <p className="text-center">
                Edit your code and see real-time changes in the built-in preview window.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose HTML Code Creator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Benefit 1 */}
          <div className="flex items-start">
            <div className="bg-[#F47920] p-2 rounded-md mr-4">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Save Time & Effort</h3>
              <p>Stop writing HTML from scratch. Generate complete, working code in seconds.</p>
            </div>
          </div>
          
          {/* Benefit 2 */}
          <div className="flex items-start">
            <div className="bg-[#F47920] p-2 rounded-md mr-4">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">No Coding Experience Needed</h3>
              <p>Perfect for beginners and experts alike. Just describe what you want in plain English.</p>
            </div>
          </div>
          
          {/* Benefit 3 */}
          <div className="flex items-start">
            <div className="bg-[#F47920] p-2 rounded-md mr-4">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Clean, Modern Code</h3>
              <p>Our AI produces optimized, responsive code that works on all devices.</p>
            </div>
          </div>
          
          {/* Benefit 4 */}
          <div className="flex items-start">
            <div className="bg-[#F47920] p-2 rounded-md mr-4">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Instant Preview</h3>
              <p>See your changes in real-time with our built-in preview window.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-[#1E4B8F] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to create amazing HTML?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Sign up for a free trial and start building web content in minutes.
          </p>
          
          <Link
            href="/auth"
            className="bg-[#F47920] text-white px-8 py-3 rounded-lg text-lg font-bold uppercase hover:bg-[#D96510] transition-all inline-block"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#0C2340] border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} HTML Code Creator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
