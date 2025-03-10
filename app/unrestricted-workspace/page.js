'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ErrorBoundary from '../../components/ErrorBoundary'

// Dynamically import components to avoid hydration issues
const ChatBox = dynamic(() => import('../../components/ChatBox'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full bg-[#1E4B8F] rounded-3xl overflow-hidden">
      <div className="bg-[#0C2340] p-4 text-white text-center">
        <h2 className="text-lg font-bold">Chat with AI</h2>
      </div>
      <div className="flex-grow p-4 animate-pulse bg-[#0C2340] bg-opacity-50"></div>
    </div>
  )
})

const CodeEditor = dynamic(() => import('../../components/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full bg-[#1E4B8F] rounded-3xl overflow-hidden">
      <div className="bg-[#0C2340] p-4 text-white">
        <h2 className="text-lg font-bold">HTML Code</h2>
      </div>
      <div className="flex-grow p-4 animate-pulse bg-[#0C2340] bg-opacity-50"></div>
    </div>
  )
})

const HtmlPreview = dynamic(() => import('../../components/HtmlPreview'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full bg-[#1E4B8F] rounded-3xl overflow-hidden">
      <div className="bg-[#0C2340] p-4 text-white">
        <h2 className="text-lg font-bold">Preview</h2>
      </div>
      <div className="flex-grow animate-pulse bg-white"></div>
    </div>
  )
})

// Helper to standardize errors
const createStandardizedError = (error) => {
  // Handle string errors
  if (typeof error === 'string') {
    return {
      name: 'Error',
      message: error,
      stack: new Error(error).stack,
    };
  }
  
  // Handle errors that might be plain objects
  return {
    name: error?.name || 'Error',
    message: error?.message || String(error) || 'Unknown error',
    stack: error?.stack || new Error().stack,
    ...error // Preserve any other properties
  };
};

export default function UnrestrictedWorkspace() {
  const [html, setHtml] = useState('')
  const [isClient, setIsClient] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [errors, setErrors] = useState([])
  const [componentStatus, setComponentStatus] = useState({
    chatBox: { loaded: false, error: null },
    codeEditor: { loaded: false, error: null },
    htmlPreview: { loaded: false, error: null }
  })
  
  // Log initial render
  useEffect(() => {
    console.log('[UnrestrictedWorkspace] Component mounting')
    
    // Mark as client-side
    setIsClient(true)
    
    return () => {
      console.log('[UnrestrictedWorkspace] Component unmounting')
    }
  }, [])
  
  // Track changes to HTML
  useEffect(() => {
    if (html) {
      console.log('[UnrestrictedWorkspace] HTML updated, length:', html.length)
    }
  }, [html])
  
  // Track loading of all components - adding a debounce mechanism
  useEffect(() => {
    // Check if all components are loaded
    const allLoaded = Object.values(componentStatus).every(status => status.loaded);
    if (allLoaded) {
      console.log('[UnrestrictedWorkspace] All components loaded successfully');
    }
  }, [componentStatus]);
  
  // Error handling utility
  const addError = (source, error) => {
    try {
      // Standardize the error
      const standardizedError = createStandardizedError(error);
      
      console.group(`[UnrestrictedWorkspace] Error in ${source}:`);
      console.error('Error details:', {
        name: standardizedError.name,
        message: standardizedError.message,
        stack: standardizedError.stack
      });
      console.groupEnd();
      
      const newError = {
        id: Date.now(),
        source,
        message: standardizedError.message,
        name: standardizedError.name,
        timestamp: new Date().toISOString(),
        stack: standardizedError.stack
      };
      
      setErrors(prev => [...prev, newError]);
      
      // Update component status
      if (['chatBox', 'codeEditor', 'htmlPreview'].includes(source)) {
        setComponentStatus(prev => ({
          ...prev,
          [source]: { ...prev[source], error: newError }
        }));
      }
    } catch (handlingError) {
      // Last resort error handling to avoid empty error objects
      console.error('Error in error handling:', {
        message: handlingError?.message || 'Unknown error in error handler',
        originalSource: source,
        originalError: String(error) || 'Unknown original error'
      });
    }
  };
  
  // Component loaded callback
  const handleComponentLoaded = (component) => {
    console.log(`[UnrestrictedWorkspace] ${component} loaded successfully`)
    
    // Only update if not already loaded to prevent re-renders
    setComponentStatus(prev => {
      // If already loaded, don't trigger a re-render
      if (prev[component].loaded) {
        return prev;
      }
      
      // Otherwise update the loaded status
      return {
        ...prev,
        [component]: { ...prev[component], loaded: true, error: null }
      };
    });
  }
  
  // Handle HTML generation from ChatBox
  const handleHtmlGenerated = (generatedHtml) => {
    try {
      console.log('[UnrestrictedWorkspace] Received generated HTML, length:', generatedHtml?.length || 0);
      console.log('[UnrestrictedWorkspace] First 100 chars:', generatedHtml?.substring(0, 100));
      console.log('[UnrestrictedWorkspace] Last 100 chars:', generatedHtml?.substring(generatedHtml?.length - 100, generatedHtml?.length));
      
      // DEBUG: Check if content is HTML
      const isHtml = generatedHtml && (
        generatedHtml.trim().startsWith('<!DOCTYPE html>') || 
        generatedHtml.trim().startsWith('<html') ||
        generatedHtml.includes('<body>')
      );
      console.log('[UnrestrictedWorkspace] Content appears to be HTML:', isHtml);
      
      // Try parsing as JSON to validate it's NOT JSON
      try {
        JSON.parse(generatedHtml);
        console.error('[UnrestrictedWorkspace] WARNING: Content incorrectly parsed as JSON! This should not happen.');
      } catch (e) {
        console.log('[UnrestrictedWorkspace] Content is not JSON (expected behavior)');
      }
      
      // Make sure we have valid HTML content
      if (generatedHtml && typeof generatedHtml === 'string') {
        setHtml(generatedHtml)
      } else {
        console.error('[UnrestrictedWorkspace] Invalid HTML received:', generatedHtml);
      }
    } catch (error) {
      console.error('[UnrestrictedWorkspace] Error handling generated HTML:', error);
      addError('html_generation', error);
    }
  }
  
  // Handle HTML updates from CodeEditor
  const handleHtmlChange = (updatedHtml) => {
    try {
      // Only log substantial changes to avoid spam
      if (Math.abs((updatedHtml?.length || 0) - (html?.length || 0)) > 50) {
        console.log('[UnrestrictedWorkspace] HTML edited in CodeEditor')
      }
      setHtml(updatedHtml)
    } catch (error) {
      addError('html_update', error)
    }
  }
  
  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    try {
      setAutoRefresh(prev => !prev)
      console.log('[UnrestrictedWorkspace] Auto-refresh toggled:', !autoRefresh)
    } catch (error) {
      addError('toggle_refresh', error)
    }
  }
  
  // Export HTML to file
  const handleExport = () => {
    try {
      if (!html) {
        console.log('[UnrestrictedWorkspace] Export attempted with no HTML')
        alert('No HTML to export yet! Generate some HTML first.')
        return
      }
      
      console.log('[UnrestrictedWorkspace] Exporting HTML to file')
      
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'generated-html.html'
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      console.log('[UnrestrictedWorkspace] HTML exported successfully')
    } catch (error) {
      console.error('[UnrestrictedWorkspace] Error exporting HTML:', error)
      addError('export_html', error)
    }
  }
  
  return (
    <div className="min-h-screen bg-[#0C2340] text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">HTML Code Creator <span className="text-[#F47920] text-sm font-normal">Unrestricted Mode</span></h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <button
              onClick={toggleAutoRefresh}
              className={`px-3 py-1 rounded text-sm ${autoRefresh ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
              aria-label={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}
              title={autoRefresh ? 'Auto-refresh is ON' : 'Auto-refresh is OFF'}
            >
              {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
            </button>
          </div>
          
          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
            disabled={!html}
            title="Export HTML to file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="container mx-auto p-4">
        {/* Component status indicators for debugging */}
        {errors.length > 0 && (
          <div className="bg-red-900 bg-opacity-50 p-2 rounded mb-4 overflow-auto max-h-32">
            <h3 className="text-red-300 text-sm font-bold mb-1">Errors:</h3>
            <ul className="text-xs space-y-1">
              {errors.slice(-3).map(error => (
                <li key={error.id} className="text-red-200">
                  <span className="font-mono text-red-300">[{error.source}]</span> {error.message}
                </li>
              ))}
              {errors.length > 3 && (
                <li className="text-red-400 text-xs italic">
                  + {errors.length - 3} more errors (check console)
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-160px)]">
          {/* Code Editor - Now takes left half of the screen */}
          <div className="relative h-full">
            <ErrorBoundary
              fallback={<div className="bg-red-900 rounded-lg p-6 h-full flex items-center justify-center">Failed to load Code Editor</div>}
              onError={(error) => addError('codeEditor', error)}
            >
              <CodeEditor
                html={html}
                onCodeChange={handleHtmlChange}
                onLoaded={() => handleComponentLoaded('codeEditor')}
                onError={(error) => addError('codeEditor', error)}
              />
            </ErrorBoundary>
            
            {!componentStatus.codeEditor.loaded && !componentStatus.codeEditor.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0C2340] bg-opacity-75 pointer-events-none">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          
          {/* Preview - Now takes right half of the screen */}
          <div className="relative h-full">
            <ErrorBoundary
              fallback={<div className="bg-red-900 rounded-lg p-6 h-full flex items-center justify-center">Failed to load HTML Preview</div>}
              onError={(error) => addError('htmlPreview', error)}
            >
              <HtmlPreview
                html={html}
                autoRefresh={autoRefresh}
                onLoaded={() => handleComponentLoaded('htmlPreview')}
                onError={(error) => addError('htmlPreview', error)}
              />
            </ErrorBoundary>
            
            {!componentStatus.htmlPreview.loaded && !componentStatus.htmlPreview.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0C2340] bg-opacity-75 pointer-events-none">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Chat Component */}
      <ErrorBoundary
        fallback={<div className="fixed bottom-4 right-4 p-4 bg-red-800 text-white rounded-lg shadow-lg">Chat failed to load</div>}
        onError={(error) => addError('chatBox', error)}
      >
        <ChatBox
          onHtmlGenerated={handleHtmlGenerated}
          onLoaded={() => handleComponentLoaded('chatBox')}
          onError={(error) => addError('chatBox', error)}
        />
      </ErrorBoundary>
      
      {/* Initialization state / Loading overlay */}
      {!isClient && (
        <div className="fixed inset-0 bg-[#0C2340] flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-[#F47920] mx-auto mb-4"></div>
            <p className="text-[#F47920] text-lg">Loading HTML Code Creator...</p>
          </div>
        </div>
      )}
    </div>
  )
}
