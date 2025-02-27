'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function ChatBox({ onHtmlGenerated }) {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Hello! Describe what HTML code you want me to create for you.' }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onSubmit = async (data) => {
    try {
      // Add user message to chat
      const userMessage = { role: 'user', content: data.message }
      setMessages(prev => [...prev, userMessage])
      setIsLoading(true)
      reset()

      // Call API to generate HTML
      const response = await fetch('/api/generateHtml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: data.message }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate HTML')
      }

      const result = await response.json()
      
      // Add AI response to chat
      const aiMessage = { 
        role: 'assistant', 
        content: 'I\'ve generated the HTML code based on your description. Check it out in the preview!' 
      }
      setMessages(prev => [...prev, aiMessage])
      
      // Send HTML to parent component
      if (result.html) {
        onHtmlGenerated(result.html)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Sorry, I encountered an error generating the HTML. Please try again.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#1E4B8F] rounded-3xl overflow-hidden">
      <div className="bg-[#0C2340] p-4 text-white text-center">
        <h2 className="text-lg font-bold">Chat with AI</h2>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-xl max-w-[85%] ${
              message.role === 'user' 
                ? 'bg-[#F47920] text-white ml-auto' 
                : 'bg-[#0C2340] text-white'
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-[#0C2340] text-white p-3 rounded-xl max-w-[85%] flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-300"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 border-t border-gray-700">
        <div className="flex">
          <input
            type="text"
            {...register('message', { required: 'Please enter a message' })}
            placeholder="Describe your HTML needs..."
            className="flex-grow p-2 rounded-l bg-[#0C2340] text-white border-none focus:outline-none focus:ring-2 focus:ring-[#F47920]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#F47920] text-white px-4 py-2 rounded-r font-bold hover:bg-[#D96510] transition-all disabled:opacity-50"
          >
            Send
          </button>
        </div>
        {errors.message && (
          <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
        )}
      </form>
    </div>
  )
}
