import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link className="text-lg font-bold" href="/">HTML Code Creator</Link>
            <div className="flex items-center gap-2">
              <Link className="text-sm" href="/pricing">Pricing</Link>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="flex flex-col gap-20 max-w-5xl p-5">
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
                <p>Create complex HTML code using simple text prompts. Our AI understands your needs and generates complete, responsive HTML solutions.</p>
              </div>
              
              <div className="bg-[#0A1D33] p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Real-time Preview</h3>
                <p>See your HTML come to life instantly with our built-in preview window. Make changes and watch them update in real-time.</p>
              </div>
              
              <div className="bg-[#0A1D33] p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Code Customization</h3>
                <p>Fine-tune the generated code with our intuitive editor. Make tweaks and improvements while maintaining best practices.</p>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#F47920] flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h3 className="text-xl font-bold mb-3">Describe What You Need</h3>
                <p>Tell our AI what kind of HTML you want to create, providing as much or as little detail as you wish.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#F47920] flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h3 className="text-xl font-bold mb-3">Review and Edit</h3>
                <p>See the generated HTML code and preview it in real-time. Make any necessary adjustments.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#F47920] flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h3 className="text-xl font-bold mb-3">Export and Use</h3>
                <p>Export your perfectly crafted HTML code and use it in your website or application.</p>
              </div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Creating?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">Join thousands of developers who are already saving time with HTML Code Creator.</p>
            <Link 
              className="bg-[#F47920] text-white px-8 py-3 rounded-lg text-lg font-bold uppercase hover:bg-[#D96510] transition-all inline-block" 
              href="/unrestricted-workspace"
            >
              Try it Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function TestPreviewPage() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('Create a landing page about flowers');
  const [apiResponse, setApiResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const iframeRef = useRef(null);

  const generateHtml = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      console.log('Sending request to API with prompt:', prompt);
      
      const response = await fetch('/api/generateHtml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      
      console.log('API response status:', response.status);
      console.log('API response content-type:', response.headers.get('content-type'));
      
      // Get the raw text response
      const responseText = await response.text();
      setApiResponse(responseText);
      
      console.log('API response text (first 100 chars):', responseText.substring(0, 100));
      
      // Check if it's HTML or JSON
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        console.log('Response is raw HTML, using it directly');
        setHtmlContent(responseText);
      } else {
        // Try to parse as JSON
        try {
          const data = JSON.parse(responseText);
          console.log('Successfully parsed response as JSON');
          if (data.html) {
            console.log('HTML content found in JSON response');
            setHtmlContent(data.html);
          } else {
            throw new Error('No HTML content in JSON response');
          }
        } catch (parseError) {
          console.error('Error parsing response as JSON:', parseError);
          setErrorMessage('Error parsing API response: ' + parseError.message);
          // Still try to use the raw response as HTML if it looks like HTML
          if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
            setHtmlContent(responseText);
          }
        }
      }
    } catch (error) {
      console.error('Error generating HTML:', error);
      setErrorMessage('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateIframe = () => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
    }
  };

  useEffect(() => {
    updateIframe();
  }, [htmlContent]);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <Head>
        <title>HTML Preview Test</title>
      </Head>
      
      <h1>HTML Preview Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="prompt" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Prompt:
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', minHeight: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      <button 
        onClick={generateHtml} 
        disabled={isLoading}
        style={{
          padding: '10px 16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? 'Generating...' : 'Generate HTML'}
      </button>
      
      {errorMessage && (
        <div style={{ margin: '20px 0', padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          {errorMessage}
        </div>
      )}
      
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h2>Raw API Response</h2>
          <pre style={{ 
            padding: '16px', 
            backgroundColor: '#f5f5f5', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {apiResponse ? apiResponse.substring(0, 1000) + (apiResponse.length > 1000 ? '...' : '') : 'No response yet'}
          </pre>
        </div>
        
        <div>
          <h2>Preview</h2>
          <div style={{ 
            height: '500px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <iframe
              ref={iframeRef}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="HTML Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
