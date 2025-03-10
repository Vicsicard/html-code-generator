'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'

// Helper to standardize errors
const createStandardError = (context, error) => {
  // If error is a string, convert to Error object
  if (typeof error === 'string') {
    return {
      name: 'Error',
      message: error,
      context,
      stack: new Error(error).stack
    };
  }
  
  // If error is already an Error object or similar, ensure it has all needed properties
  return {
    name: error?.name || 'Error',
    message: error?.message || String(error) || 'Unknown error',
    context,
    stack: error?.stack || new Error().stack,
    timestamp: new Date().toISOString()
  };
};

export default function ChatBox({ onHtmlGenerated, onError, onLoaded }) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false) // New state to track initialization
  const [pageContext, setPageContext] = useState(null) // Store context about the current page
  const messagesEndRef = useRef(null)
  const onLoadedRef = useRef(onLoaded) // Store callback in ref to avoid dependency issues
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // Update ref when onLoaded changes
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  // Error handling helper
  const handleError = (context, error) => {
    try {
      // Create a standardized error object
      const standardError = createStandardError(context, error);
      
      // Log the standardized error
      console.group(`[ChatBox] Error in ${context}:`);
      console.error('Error details:', {
        name: standardError.name,
        message: standardError.message,
        stack: standardError.stack
      });
      console.groupEnd();
      
      // Call the parent's error handler if available
      if (onError && typeof onError === 'function') {
        try {
          onError(standardError);
        } catch (callbackError) {
          console.error('[ChatBox] Error in onError callback:', {
            message: callbackError?.message || 'Unknown callback error',
            stack: callbackError?.stack
          });
        }
      }
      
      return standardError;
    } catch (handlingError) {
      // Last resort error handling
      console.error('[ChatBox] Error while handling error:', {
        message: handlingError?.message || 'Unknown error in error handler',
        originalContext: context,
        originalError: String(error) || 'Unknown original error'
      });
      
      // Return a basic error object
      return {
        name: 'Error',
        message: 'Error occurred (see console for details)',
        context: 'error_handler',
        stack: new Error().stack,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Initialize welcome message on client-side only to avoid hydration mismatch
  useEffect(() => {
    try {
      // Skip if already initialized
      if (isInitialized) {
        return;
      }
      
      console.log('[ChatBox] Initializing component')
      setMessages([{ 
        role: 'system', 
        content: 'Welcome to HTML Code Creator! Describe what HTML you would like to create.' 
      }])
      
      // Mark as initialized
      setIsInitialized(true)
      
      // Use ref to break dependencies and avoid update loops
      // Use setTimeout to further prevent render cycles
      if (onLoadedRef.current) {
        setTimeout(() => {
          try {
            console.log('[ChatBox] Notifying parent component of successful load')
            onLoadedRef.current();
          } catch (callbackError) {
            console.error('[ChatBox] Error in onLoaded callback:', callbackError);
          }
        }, 0);
      }
    } catch (error) {
      handleError('initialization', error)
    }
    
    // Cleanup function
    return () => {
      console.log('[ChatBox] Component unmounting')
    }
  }, [isInitialized]) // Only depend on isInitialized to prevent multiple runs

  // Scroll to bottom of chat
  useEffect(() => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (error) {
      handleError('scroll', error)
    }
  }, [messages])

  // Handle API call to generate HTML
  const generateHtml = async (message) => {
    try {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'user',
          content: message,
        },
      ])

      setIsLoading(true)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: 'Generating HTML...',
        },
      ])

      // Create a fallback HTML response in case everything else fails
      const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fallback Page</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1 { color: #1a73e8; }
    .error-note {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      padding: 1rem;
      margin: 2rem 0;
    }
  </style>
</head>
<body>
  <h1>Fallback HTML Content</h1>
  <p>The AI was unable to generate the HTML as requested. This is a fallback page created when errors occur.</p>
  <p>Your prompt was: "${message.replace(/"/g, '&quot;')}"</p>
</body>
</html>`;

      console.log('[ChatBox] Generating HTML with prompt:', message.substring(0, 50) + '...')
      
      // Check authentication before making the API call
      const authResponse = await fetch('/api/auth/check')
      if (!authResponse.ok) {
        console.error('[ChatBox] Authentication check failed, status:', authResponse.status)
        
        // Add error message to chat
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: 'assistant',
            content: "Sorry, you need to be logged in to generate HTML. Please log in and try again.",
          },
        ])
        setIsLoading(false)
        
        return { success: false, error: 'Authentication required' }
      }
      
      // Proceed with the API call for HTML generation
      console.log('[ChatBox] Sending request to API with prompt:', message.substring(0, 50) + '...')
      
      // If the prompt is about flowers, use our hardcoded flowers API
      const isFlowerRequest = message.toLowerCase().includes('flower') || 
                             message.toLowerCase().includes('floral') ||
                             message.toLowerCase().includes('garden');
      
      const apiEndpoint = isFlowerRequest ? '/api/hardcoded-flowers' : '/api/generateHtml';
      console.log(`[ChatBox] Using API endpoint: ${apiEndpoint} (isFlowerRequest: ${isFlowerRequest})`);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/html' // Expect HTML response directly
        },
        body: JSON.stringify({ prompt: message }),
      })

      console.log('[ChatBox] Response status:', response.status)
      console.log('[ChatBox] Response content-type:', response.headers.get('content-type'))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('[ChatBox] API error response:', errorText)
        
        // If the response is a 401, it means we need to authenticate
        if (response.status === 401) {
          // Redirect to auth page
          window.location.href = '/auth'
          return { success: false, error: 'Authentication required' }
        }
        
        throw new Error(`Server error (${response.status})`)
      }

      // Get response data as text - we're now expecting HTML directly
      console.log('[ChatBox] Getting response text...')
      const html = await response.text()
      console.log('[ChatBox] Content-Type:', response.headers.get('content-type'))
      console.log('[ChatBox] Received HTML response, length:', html.length)
      console.log('[ChatBox] First 100 chars of response:', html.substring(0, 100))
      console.log('[ChatBox] Last 100 chars of response:', html.substring(html.length - 100, html.length))
      
      // DEBUG: Log if content appears to be HTML
      const isHtml = html.trim().startsWith('<!DOCTYPE html>') || 
                     html.trim().startsWith('<html') ||
                     html.includes('<body>');
      console.log('[ChatBox] Content appears to be HTML:', isHtml);
      
      // DEBUG: Try JSON parsing to see if it erroneously succeeds
      try {
        JSON.parse(html);
        console.error('[ChatBox] WARNING: Content incorrectly parsed as JSON!');
      } catch (e) {
        console.log('[ChatBox] Content is not JSON (expected behavior)');
      }
      
      // Check if the response is an auth page redirect
      if (html.includes('<title>HTML Code Creator - Authentication</title>') || 
          html.includes('login-form') || 
          html.includes('signup-form')) {
        console.error('[ChatBox] Received auth page instead of HTML content')
        window.location.href = '/auth'
        return { success: false, error: 'Authentication required' }
      }
      
      // Add the assistant message with abbreviated HTML preview
      const htmlPreview = html.length > 100 
        ? html.substring(0, 100) + '...' 
        : html
        
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: `I've created HTML code based on your request. Here's a preview:\n\n\`\`\`html\n${htmlPreview}\n\`\`\`\n\nYou can see the full result in the preview panel.`,
        },
      ])

      // Call the callback with the generated HTML
      if (onHtmlGenerated && typeof onHtmlGenerated === 'function') {
        console.log('[ChatBox] Sending HTML to parent component, length:', html.length);
        onHtmlGenerated(html);
      }
    } catch (apiError) {
      console.error('[ChatBox] API or parsing error:', apiError)
      
      // In case of error, use fallback HTML
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: `Error generating HTML: ${apiError.message}. I'll provide a fallback template instead.`,
        },
      ])
      
      // Still provide fallback HTML to preview
      if (onHtmlGenerated && typeof onHtmlGenerated === 'function') {
        console.log('[ChatBox] Sending fallback HTML to parent component');
        onHtmlGenerated(fallbackHtml);
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      if (!data.message || data.message.trim() === '') {
        console.log('[ChatBox] Empty message submitted, ignoring')
        return
      }

      console.log('[ChatBox] Processing user message:', data.message.substring(0, 30) + (data.message.length > 30 ? '...' : ''))
      
      await generateHtml(data.message)
    } catch (error) {
      // Use the standardized error from handleError or create a new one
      const standardError = error.context ? 
        error : 
        handleError('api_request', error);
      
      // Add error message to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${standardError.message}. Please try again.`,
        },
      ])
    }
  }

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat button */}
      <button 
        onClick={toggleChat}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        {isChatOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
      
      {/* Chat window */}
      {isChatOpen && (
        <div className="absolute bottom-16 right-0 w-72 h-96 flex flex-col bg-[#1E4B8F] rounded-xl overflow-hidden shadow-xl">
          <div className="bg-[#0C2340] p-2 text-white text-center flex justify-between items-center">
            <h2 className="text-sm font-bold">Chat with AI</h2>
            <button 
              onClick={toggleChat} 
              className="text-white hover:text-gray-300"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-2 space-y-2">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-lg max-w-[85%] text-sm ${
                  message.role === 'user' 
                    ? 'bg-[#F47920] text-white ml-auto' 
                    : 'bg-[#0C2340] text-white'
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-[#0C2340] text-white p-2 rounded-lg max-w-[85%] flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse delay-150"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse delay-300"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-2 border-t border-gray-700">
            <div className="flex">
              <input
                type="text"
                {...register('message', { required: 'Please enter a message' })}
                placeholder="Describe your HTML needs..."
                className="flex-grow p-1.5 text-sm rounded-l bg-[#0C2340] text-white border-none focus:outline-none focus:ring-1 focus:ring-[#F47920]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#F47920] text-white px-2 py-1.5 rounded-r text-sm font-bold hover:bg-[#D96510] transition-all disabled:opacity-50"
              >
                Send
              </button>
            </div>
            {errors.message && (
              <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
