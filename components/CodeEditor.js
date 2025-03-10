'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Import codemirror styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

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

// Dynamically import CodeMirror with SSR disabled
const CodeMirror = dynamic(
  () => {
    try {
      console.log('[CodeEditor] Loading CodeMirror component')
      // Import codemirror language modes on client side only
      require('codemirror/mode/htmlmixed/htmlmixed')
      require('codemirror/mode/javascript/javascript')
      require('codemirror/mode/css/css')
      
      // Import the component
      return import('react-codemirror2').then(mod => {
        console.log('[CodeEditor] CodeMirror loaded successfully')
        return mod.Controlled
      })
    } catch (error) {
      console.error('[CodeEditor] Error loading CodeMirror:', {
        message: error?.message || 'Unknown error loading CodeMirror',
        stack: error?.stack || 'No stack trace'
      })
      throw error
    }
  },
  { 
    ssr: false,
    loading: () => {
      console.log('[CodeEditor] Rendering CodeMirror loading state')
      return <div className="animate-pulse bg-gray-800 h-full w-full rounded"></div>
    }
  }
)

export default function CodeEditor({ html, onCodeChange, onError, onLoaded }) {
  const [code, setCode] = useState(html || '')
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [editorErrors, setEditorErrors] = useState([])
  const onLoadedRef = useRef(onLoaded) // Store callback in ref to avoid dependency issues
  
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
      console.group(`[CodeEditor] Error in ${context}:`);
      console.error('Error details:', {
        name: standardError.name,
        message: standardError.message,
        stack: standardError.stack
      });
      console.groupEnd();
      
      // Add to editor errors list
      const errorInfo = { 
        id: Date.now(), 
        context, 
        message: standardError.message, 
        name: standardError.name,
        stack: standardError.stack
      };
      
      setEditorErrors(prev => [...prev, errorInfo]);
      
      // Call the parent's error handler if available
      if (onError && typeof onError === 'function') {
        try {
          onError(standardError);
        } catch (callbackError) {
          console.error('[CodeEditor] Error in onError callback:', {
            message: callbackError?.message || 'Unknown callback error',
            stack: callbackError?.stack
          });
        }
      }
      
      return standardError;
    } catch (handlingError) {
      // Last resort error handling
      console.error('[CodeEditor] Error while handling error:', {
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
  };
  
  // Sync with incoming html prop
  useEffect(() => {
    try {
      // Only update if the value has actually changed AND is different from the current code
      if (html !== undefined && html !== code) {
        console.log('[CodeEditor] Updating code from html prop')
        setCode(html)
      }
    } catch (error) {
      handleError('update_from_prop', error)
    }
  }, [html]) // Removed code from dependency array to prevent infinite updates
  
  // Notify parent when editor is fully loaded - using ref to avoid dependency cycles
  useEffect(() => {
    try {
      if (editorLoaded && onLoadedRef.current) {
        console.log('[CodeEditor] Notifying parent component of successful load')
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
  }, [editorLoaded]) // Only depend on editorLoaded, not onLoaded
  
  // Track when editor is fully loaded
  useEffect(() => {
    console.log('[CodeEditor] Component mounted')
    return () => {
      console.log('[CodeEditor] Component unmounting')
    }
  }, [])
  
  const handleClear = () => {
    try {
      console.log('[CodeEditor] Clearing editor content')
      setCode('')
      if (onCodeChange) {
        onCodeChange('')
      }
    } catch (error) {
      handleError('clear_code', error)
    }
  }
  
  const handleCopy = () => {
    try {
      console.log('[CodeEditor] Copying code to clipboard, length:', code?.length || 0)
      
      navigator.clipboard.writeText(code)
        .then(() => {
          console.log('[CodeEditor] Code copied to clipboard successfully')
          // Show toast or alert that code was copied
          alert('Code copied to clipboard!')
        })
        .catch(err => {
          console.error('[CodeEditor] Could not copy code to clipboard:', {
            message: err?.message || 'Unknown clipboard error',
            stack: err?.stack
          })
          handleError('clipboard_copy', err || new Error('Failed to copy to clipboard'))
          alert(`Failed to copy: ${err?.message || 'Unknown clipboard error'}`)
        })
    } catch (error) {
      handleError('copy_code', error)
      alert(`Could not copy code: ${error?.message || 'Unknown error'}`)
    }
  }
  
  const handleEditorDidMount = () => {
    try {
      console.log('[CodeEditor] Editor mounted successfully')
      setEditorLoaded(true)
    } catch (error) {
      handleError('editor_mount', error)
    }
  }
  
  const handleBeforeChange = (editor, data, value) => {
    try {
      // Only log substantial changes to avoid console spam
      if (Math.abs((value?.length || 0) - (code?.length || 0)) > 10) {
        console.log('[CodeEditor] Code updated, new length:', value?.length || 0)
      }
      
      setCode(value)
      if (onCodeChange) {
        onCodeChange(value)
      }
    } catch (error) {
      handleError('update_code', error)
    }
  }
  
  return (
    <div className="flex flex-col h-full bg-[#1E4B8F] rounded-3xl overflow-hidden">
      {editorErrors.length > 0 && (
        <div className="bg-red-800 text-white p-2 text-sm">
          <details>
            <summary className="cursor-pointer">
              {editorErrors.length} editor error{editorErrors.length > 1 ? 's' : ''}
            </summary>
            <ul className="pl-4 mt-1 max-h-40 overflow-auto">
              {editorErrors.map(err => (
                <li key={err.id} className="text-xs border-l-2 border-red-500 pl-2 mb-1">
                  <strong>{err.context}:</strong> {err.name}: {err.message || 'Unknown error'}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
      
      <div className="bg-[#0C2340] p-4 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold">HTML Code</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleClear}
            className="bg-[#7B4F39] text-white px-3 py-1 rounded text-sm font-bold uppercase hover:bg-[#5F3928] transition-all"
          >
            Clear
          </button>
          <button
            onClick={handleCopy}
            className="bg-[#F47920] text-white px-3 py-1 rounded text-sm font-bold uppercase hover:bg-[#D96510] transition-all"
          >
            Copy
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-hidden">
        <CodeMirror
          value={code}
          options={{
            mode: 'htmlmixed',
            theme: 'material',
            lineNumbers: true,
            lineWrapping: true,
            readOnly: false, // Allow editing
            styleActiveLine: true,
          }}
          onBeforeChange={handleBeforeChange}
          editorDidMount={handleEditorDidMount}
          className="h-full"
        />
      </div>
    </div>
  )
}
