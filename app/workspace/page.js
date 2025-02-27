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

        // Redirect to pricing if trial is expired
        if (status.isExpired) {
          router.push('/pricing')
        }
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
      <header className="bg-[#0C2340] border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            HTML Code Creator
          </Link>
          
          <div className="flex items-center space-x-4">
            {trialInfo.hoursPassed !== undefined && !trialInfo.isExpired && (
              <div className="text-sm">
                Free trial: {Math.max(0, 60 - Math.floor(trialInfo.hoursPassed * 60))} minutes left
              </div>
            )}
            
            <button
              onClick={handleSignOut}
              className="bg-[#7B4F39] text-white px-4 py-2 rounded text-sm font-bold uppercase hover:bg-[#5F3928] transition-all"
            >
              Sign Out
            </button>
            
            <Link
              href="/pricing"
              className="bg-[#F47920] text-white px-4 py-2 rounded text-sm font-bold uppercase hover:bg-[#D96510] transition-all"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Workspace */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
          {/* Chat Section */}
          <div className="h-full">
            <ChatBox onHtmlGenerated={handleHtmlGenerated} />
          </div>
          
          {/* Code Editor Section */}
          <div className="h-full">
            <CodeEditor html={html} onCodeChange={handleCodeChange} />
          </div>
          
          {/* Preview Section */}
          <div className="h-full">
            <HtmlPreview html={html} autoRefresh={autoRefresh} />
          </div>
        </div>
      </div>
    </div>
  )
}
