'use client'

import { useState, useEffect, useRef } from 'react'

export default function HtmlPreview({ html, autoRefresh = true }) {
  const [preview, setPreview] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const iframeRef = useRef(null)
  
  // Update preview when html changes
  useEffect(() => {
    if (autoRefresh && html) {
      // Add fade effect by briefly hiding the preview
      setIsVisible(false)
      
      // Short delay for animation
      const timer = setTimeout(() => {
        setPreview(html)
        setIsVisible(true)
      }, 300)
      
      return () => clearTimeout(timer)
    }
  }, [html, autoRefresh])
  
  // Manual refresh button handler
  const handleRefresh = () => {
    setIsVisible(false)
    
    setTimeout(() => {
      setPreview(html)
      setIsVisible(true)
    }, 300)
  }
  
  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    if (!autoRefresh) {
      // If turning on auto-refresh, immediately update the preview
      setPreview(html)
    }
  }
  
  return (
    <div className="flex flex-col h-full bg-[#1E4B8F] rounded-3xl overflow-hidden">
      <div className="bg-[#0C2340] p-4 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold">Live Preview</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={toggleAutoRefresh}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="autoRefresh" className="text-sm">Auto-refresh</label>
          </div>
          
          {!autoRefresh && (
            <button
              onClick={handleRefresh}
              className="bg-[#F47920] text-white px-3 py-1 rounded text-sm font-bold uppercase hover:bg-[#D96510] transition-all"
            >
              Refresh
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-grow p-4 bg-white overflow-hidden">
        <div 
          className={`w-full h-full transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <iframe
            ref={iframeRef}
            srcDoc={preview}
            title="HTML Preview"
            className="w-full h-full border-0 rounded"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  )
}
