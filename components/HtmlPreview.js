'use client'

import { useState, useEffect, useRef } from 'react'

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

export default function HtmlPreview({ html, autoRefresh = true, onError, onLoaded }) {
  const iframeRef = useRef(null)
  const [previewHtml, setPreviewHtml] = useState('')
  const [loadStatus, setLoadStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState(null)
  const [renderCount, setRenderCount] = useState(0)
  const onLoadedRef = useRef(onLoaded) // Store callback in ref to avoid dependency cycles
  
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
      console.group(`[HtmlPreview] Error in ${context}:`);
      console.error('Error details:', {
        name: standardError.name,
        message: standardError.message,
        stack: standardError.stack
      });
      console.groupEnd();
      
      // Update component state
      setLoadStatus('error')
      setErrorMessage(`${context}: ${standardError.message}`)
      
      // Call the parent's error handler if available
      if (onError && typeof onError === 'function') {
        try {
          onError(standardError);
        } catch (callbackError) {
          console.error('[HtmlPreview] Error in onError callback:', {
            message: callbackError?.message || 'Unknown callback error',
            stack: callbackError?.stack
          });
        }
      }
      
      return standardError;
    } catch (handlingError) {
      // Last resort error handling
      console.error('[HtmlPreview] Error while handling error:', {
        message: handlingError?.message || 'Unknown error in error handler',
        originalContext: context,
        originalError: String(error) || 'Unknown original error'
      });
      
      // Update component state with basic error info
      setLoadStatus('error')
      setErrorMessage('Error occurred (see console for details)')
      
      // Return a basic error object
      return {
        name: 'Error',
        message: 'Error occurred (see console for details)',
        context: 'error_handler',
        stack: new Error().stack,
        timestamp: new Date().toISOString()
      };
    }
  };
  
  // Initialize component with default empty preview
  useEffect(() => {
    try {
      console.log('[HtmlPreview] Component mounted');
      setLoadStatus('loading');
      
      // Set initial HTML if available
      if (html) {
        console.log('[HtmlPreview] Initial HTML available, length:', html?.length || 0);
        setPreviewHtml(html);
      } else {
        console.log('[HtmlPreview] No initial HTML available');
        setPreviewHtml('');
      }
    } catch (error) {
      handleError('initialization', error);
    }
    
    return () => {
      console.log('[HtmlPreview] Component unmounting');
    };
  }, []);
  
  // Update preview when html prop changes
  useEffect(() => {
    try {
      if (autoRefresh && html !== undefined && html !== previewHtml) {
        console.log('[HtmlPreview] Updating preview with new HTML, length:', html?.length || 0)
        console.log('[HtmlPreview] First 100 chars of incoming HTML:', html?.substring(0, 100) || '')
        console.log('[HtmlPreview] Last 100 chars of incoming HTML:', html?.substring(html?.length - 100, html?.length) || '')
        
        // DEBUG: Check if the HTML appears to be valid
        const isValidHtml = html && (
          html.trim().startsWith('<!DOCTYPE html>') || 
          html.trim().startsWith('<html') ||
          html.includes('<body>')
        );
        console.log('[HtmlPreview] Appears to be valid HTML:', isValidHtml);
        
        // Try parsing as JSON to check if it might be incorrectly formatted
        try {
          JSON.parse(html);
          console.error('[HtmlPreview] WARNING: HTML content parsed as valid JSON - this may indicate a problem!');
        } catch (e) {
          console.log('[HtmlPreview] Content is not JSON (expected behavior for HTML)');
        }
        
        setPreviewHtml(html)
        setRenderCount(count => count + 1)
        // Reset error state when new content is loaded
        setErrorMessage(null)
        setLoadStatus('loading')
      }
    } catch (error) {
      console.error('[HtmlPreview] Error in update effect:', error)
      handleError('update_preview', error)
    }
  }, [html, autoRefresh]) // Removed previewHtml from dependencies to prevent infinite loop
  
  // Handle iframe load and error events
  useEffect(() => {
    if (!iframeRef.current) return
    
    // Define handlers
    const handleIframeLoad = () => {
      try {
        console.log('[HtmlPreview] Iframe loaded successfully')
        setLoadStatus('ready')
        setErrorMessage(null)
        
        // Setup communication with the iframe
        if (iframeRef.current.contentWindow) {
          // Add event listener for errors in the iframe
          const handleIframeError = (event) => {
            console.error('[HtmlPreview] Error in iframe content:', {
              message: event.message || 'Unknown iframe error',
              lineno: event.lineno,
              colno: event.colno,
              filename: event.filename,
              stack: event.error?.stack || 'No stack trace available'
            })
            handleError('iframe_error', event.error || new Error(event.message || 'Iframe error'))
          }
          
          // Try to attach window.onerror directly to the iframe
          try {
            iframeRef.current.contentWindow.onerror = handleIframeError
          } catch (err) {
            console.warn('[HtmlPreview] Could not attach onerror to iframe:', err)
          }
        }
      } catch (error) {
        handleError('iframe_load', error)
      }
    }
    
    const handleIframeError = (error) => {
      console.error('[HtmlPreview] Iframe failed to load:', error || 'Unknown error')
      setLoadStatus('error')
      setErrorMessage('Failed to load preview content')
      handleError('iframe_load_error', error || new Error('Failed to load preview content'))
    }
    
    // Add event listeners
    iframeRef.current.addEventListener('load', handleIframeLoad)
    iframeRef.current.addEventListener('error', handleIframeError)
    
    // Cleanup function
    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad)
        iframeRef.current.removeEventListener('error', handleIframeError)
        try {
          iframeRef.current.contentWindow.onerror = null
        } catch (err) {
          // Ignore errors when cleaning up
        }
      }
    }
  }, [iframeRef.current, renderCount])
  
  // Call onLoaded callback when component is ready - using ref to avoid dependency cycles
  useEffect(() => {
    try {
      if (loadStatus === 'ready' && onLoadedRef.current) {
        console.log('[HtmlPreview] Notifying parent component of successful load')
        // Use setTimeout to break potential render cycles
        setTimeout(() => {
          try {
            onLoadedRef.current();
          } catch (error) {
            handleError('load_notification', error);
          }
        }, 0);
      }
    } catch (error) {
      handleError('load_notification', error)
    }
  }, [loadStatus]) // Only depend on loadStatus, not onLoaded
  
  // Render HTML content with a valid and safe HTML structure
  const renderHtml = () => {
    try {
      console.log('[HtmlPreview] Rendering HTML content. Length:', previewHtml?.length || 0);
      
      // Default empty state
      if (!previewHtml || previewHtml.trim() === '') {
        console.log('[HtmlPreview] No HTML content to display');
        return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><p>No content to display</p></body></html>`;
      }

      // If the content is already a full HTML document, sanitize it first
      if (previewHtml.trim().startsWith('<!DOCTYPE html>') || previewHtml.trim().startsWith('<html')) {
        // Sanitize by removing potentially harmful scripts
        let sanitized = previewHtml;
        
        try {
          // Remove script tags that load external resources
          sanitized = sanitized.replace(/<script\b[^>]*src="[^"]*"[^>]*>([\s\S]*?)<\/script>/gi, '');
          
          // Remove references to cascade-browser-integration and other problematic scripts
          sanitized = sanitized.replace(/<script\b[^>]*src="[^"]*cascade-browser[^"]*"[^>]*>([\s\S]*?)<\/script>/gi, '');
          
          // Remove inline scripts that might cause issues
          sanitized = sanitized.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '<!-- Script removed for security -->');
          
          console.log('[HtmlPreview] Sanitized HTML, removed potentially harmful scripts');
        } catch (e) {
          console.error('[HtmlPreview] Error sanitizing HTML:', e);
        }
        
        return sanitized;
      }
      
      // Otherwise, create a simple but complete HTML document for display
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; padding: 1rem; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  ${previewHtml}
</body>
</html>`;
    } catch (error) {
      handleError('render_html', error);
      return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><p>Error rendering content: ${error.message}</p></body></html>`;
    }
  };
  
  const updatePreview = () => {
    try {
      if (html !== undefined && html !== previewHtml) {
        console.log('[HtmlPreview] Manually updating preview')
        setPreviewHtml(html)
        setRenderCount(count => count + 1)
        setErrorMessage(null)
        setLoadStatus('loading')
      } else {
        console.log('[HtmlPreview] No changes to preview or HTML is undefined')
      }
    } catch (error) {
      handleError('manual_update', error)
    }
  }
  
  // Listen for messages from the iframe
  useEffect(() => {
    const handleIframeMessage = (event) => {
      try {
        if (event.data && event.data.type === 'iframe-error') {
          console.log('[HtmlPreview] Received error message from iframe', event.data.error);
          handleError('iframe_content_error', new Error(event.data.error.message || 'Error in HTML content'));
        }
      } catch (error) {
        handleError('iframe_message', error);
      }
    };
    
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);
  
  return (
    <div className="flex flex-col h-full bg-[#1E4B8F] rounded-3xl overflow-hidden">
      <div className="bg-[#0C2340] p-4 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold">Preview</h2>
        {!autoRefresh && (
          <button
            onClick={updatePreview}
            className="bg-[#F47920] text-white px-3 py-1 rounded text-sm font-bold uppercase hover:bg-[#D96510] transition-all"
          >
            Refresh
          </button>
        )}
      </div>
      
      <div className="flex-grow relative bg-white">
        {/* Error message */}
        {errorMessage && (
          <div className="absolute top-0 left-0 right-0 bg-red-700 text-white p-2 z-10 text-xs">
            <strong>Error:</strong> {errorMessage}
            <button 
              className="ml-2 bg-red-800 px-2 py-1 rounded text-xs"
              onClick={() => setErrorMessage(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Loading indicator */}
        {loadStatus === 'loading' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F47920]"></div>
          </div>
        )}
        
        {/* Debug info in dev mode */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white p-1 text-xs z-10">
            Length: {previewHtml?.length || 0}
          </div>
        )}
        
        {/* Preview iframe */}
        <iframe
          ref={iframeRef}
          srcDoc={renderHtml()}
          className="w-full h-full border-none"
          title="HTML Preview"
          sandbox="allow-scripts"
          loading="eager"
        />
        
        {/* Fallback for severe errors */}
        {loadStatus === 'error' && !errorMessage && (
          <div className="absolute inset-0 bg-white p-4 flex flex-col items-center justify-center">
            <h3 className="text-red-600 font-bold text-lg mb-2">Preview Error</h3>
            <p className="text-gray-800 text-center">
              An error occurred while trying to display the HTML preview.
            </p>
            <button
              onClick={() => {
                setErrorMessage(null);
                setRenderCount(count => count + 1);
                setLoadStatus('loading');
              }}
              className="mt-4 bg-[#F47920] text-white px-4 py-2 rounded font-bold"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
