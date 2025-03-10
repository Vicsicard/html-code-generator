'use client'

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0C2340] text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">HTML Code Creator</h1>
        <p className="text-xl md:text-2xl text-center max-w-3xl mb-12">
          Effortlessly create beautiful, responsive HTML code with the power of AI
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link 
            className="bg-[#F47920] text-white px-8 py-3 rounded-lg text-lg font-bold uppercase hover:bg-[#D96510] transition-all" 
            href="/auth"
          >
            Get Started
          </Link>
          <Link 
            className="bg-white text-[#0C2340] px-8 py-3 rounded-lg text-lg font-bold uppercase hover:bg-gray-100 transition-all" 
            href="/pricing"
          >
            View Pricing
          </Link>
          <Link 
            className="bg-[#F47920] text-white px-8 py-3 rounded-lg text-lg font-bold uppercase hover:bg-[#D96510] transition-all" 
            href="/unrestricted-workspace"
          >
            Enter Workspace Directly
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0A1D33] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">AI-Powered Generation</h3>
            <p>Describe what you need in plain language and let our AI create the HTML code for you instantly.</p>
          </div>
          <div className="bg-[#0A1D33] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Live Preview</h3>
            <p>See your HTML rendered in real-time as you make changes to ensure it meets your expectations.</p>
          </div>
          <div className="bg-[#0A1D33] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Code Editor</h3>
            <p>Fine-tune the generated code with our built-in editor for complete control over your HTML.</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Ready to create amazing HTML?</h2>
        <Link 
          className="bg-[#F47920] text-white px-8 py-3 rounded-lg text-lg font-bold uppercase hover:bg-[#D96510] transition-all inline-block" 
          href="/auth"
        >
          Get Started Now
        </Link>
      </div>
    </div>
  );
}
