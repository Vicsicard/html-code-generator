'use client'

import { useState, useEffect } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'

// Import codemirror styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

// Import codemirror language modes on client side only
const importCodeMirrorMode = () => {
  if (typeof window !== 'undefined') {
    require('codemirror/mode/htmlmixed/htmlmixed')
    require('codemirror/mode/javascript/javascript')
    require('codemirror/mode/css/css')
  }
}

export default function CodeEditor({ html, onCodeChange }) {
  const [code, setCode] = useState(html || '')
  
  // Import codemirror modes on client side
  useEffect(() => {
    importCodeMirrorMode()
  }, [])
  
  // Update code when html prop changes
  useEffect(() => {
    if (html) {
      setCode(html)
    }
  }, [html])
  
  const handleClear = () => {
    setCode('')
    if (onCodeChange) {
      onCodeChange('')
    }
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        // Show toast or alert that code was copied
        alert('Code copied to clipboard!')
      })
      .catch(err => {
        console.error('Could not copy code: ', err)
      })
  }
  
  return (
    <div className="flex flex-col h-full bg-[#1E4B8F] rounded-3xl overflow-hidden">
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
        {typeof window !== 'undefined' && (
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
            onBeforeChange={(editor, data, value) => {
              setCode(value)
              if (onCodeChange) {
                onCodeChange(value)
              }
            }}
            className="h-full"
          />
        )}
      </div>
    </div>
  )
}
