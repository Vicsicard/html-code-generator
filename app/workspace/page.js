'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/authContext'
import ChatBox from '../../components/ChatBox'
import CodeEditor from '../../components/CodeEditor'
import HtmlPreview from '../../components/HtmlPreview'
import Link from 'next/link'

export default function WorkspacePage() {
  const [html, setHtml] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const { user, loading, signOut, checkFreeTrialStatus } = useAuth()
  const router = useRouter()
  const [trialInfo, setTrialInfo] = useState({ isLoading: true })

  // Check authentication and trial status
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }

    const checkTrial = async () => {
      if (user) {
        const status = await checkFreeTrialStatus()
        setTrialInfo({
          isLoading: false,
          ...status
        })
        
        // Only redirect if trial is actually expired - disabled for now
        if (false && status && status.isExpired) {
          router.push('/pricing')
        }
      } else {
        setTrialInfo({
          isLoading: false,
          isExpired: false,
          hoursPassed: 0
        })
      }
    }

    checkTrial()
  }, [user, loading, router, checkFreeTrialStatus])

  // Handle HTML generation from ChatBox
  const handleHtmlGenerated = (generatedHtml) => {
    setHtml(generatedHtml)
  }

  // Handle code changes from CodeEditor
  const handleCodeChange = (newCode) => {
    setHtml(newCode)
  }

  // Handle sign out
  const handleSignOut = async () => {
    await signOut()
  }

  // Handle toggle auto-refresh
  const handleToggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev)
  }

  // Handle save project
  const handleSave = () => {
    if (!html) {
      alert('No HTML to save yet! Generate some HTML first.');
      return;
    }
    
    // Save to local storage for now as a simple implementation
    try {
      const projects = JSON.parse(localStorage.getItem('htmlProjects') || '[]');
      projects.push({
        id: Date.now(),
        html,
        name: `Project ${projects.length + 1}`,
        date: new Date().toISOString()
      });
      localStorage.setItem('htmlProjects', JSON.stringify(projects));
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    }
  }

  // Handle export HTML
  const handleExport = () => {
    if (!html) {
      alert('No HTML to export yet! Generate some HTML first.');
      return;
    }
    
    // Create a blob with the HTML content
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-html.html';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // If loading or checking trial status, show loading spinner
  if (loading || trialInfo.isLoading) {
    return (
      <div className="min-h-screen bg-[#0C2340] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#F47920]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C2340] text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">HTML Code Creator</h1>
        <div className="flex items-center space-x-6">
          {!trialInfo.isLoading && (
            <div className={`px-4 py-1 rounded ${trialInfo.isExpired ? 'bg-red-600' : 'bg-green-600'}`}>
              {trialInfo.isExpired 
                ? 'Trial Expired' 
                : `Trial: ${Math.max(0, 60 - (trialInfo.hoursPassed || 0) * 60).toFixed(0)} minutes left`
              }
            </div>
          )}
          <button
            onClick={handleToggleAutoRefresh}
            className={`px-4 py-1 rounded ${autoRefresh ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
          >
            {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Save Project
          </button>
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Export HTML
          </button>
          <button
            onClick={signOut}
            className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-600"
          >
            Sign Out
          </button>
        </div>
      </header>
      
      {/* Main Workspace - Now with 2 columns instead of 3 */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-120px)]">
          {/* Code Editor Section - Now takes left half of the screen */}
          <div className="h-full">
            <CodeEditor 
              html={html} 
              onCodeChange={handleCodeChange}
              onError={(error) => console.error('Code editor error:', error)}
              onLoaded={() => console.log('Code editor loaded successfully')}
            />
          </div>
          
          {/* Preview Section - Now takes right half of the screen */}
          <div className="h-full">
            <HtmlPreview 
              html={html} 
              autoRefresh={autoRefresh}
              onError={(error) => console.error('Preview error:', error)}
              onLoaded={() => console.log('HTML preview loaded successfully')}
            />
          </div>
        </div>
      </div>
      
      {/* Floating Chat Component - Positioned absolutely in the bottom right */}
      <ChatBox 
        onHtmlGenerated={handleHtmlGenerated} 
        onError={(error) => console.error('Chat error:', error)}
        onLoaded={() => console.log('Chat component loaded successfully')}
      />
    </div>
  )
}
