import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CohereClient } from 'cohere-ai'

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
})

export async function POST(req) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to use this API' },
        { status: 401 }
      )
    }
    
    // Parse request body
    const { prompt } = await req.json()
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }
    
    // Format the prompt for Cohere
    const formattedPrompt = `You are an AI web developer that generates fully functional, optimized HTML, CSS, and JavaScript code based on user descriptions.  

## **User Request:**  
"${prompt}"  

## **Important Guidelines:**  
- Always generate **a complete and valid HTML document** unless the user specifies otherwise.  
- Include a \`<style>\` block for **CSS styling** when necessary.  
- Include a \`<script>\` block for **JavaScript functionality** if required.  
- Ensure all generated HTML is **fully responsive** for mobile and desktop.  
- Do **NOT** include explanations—return **only** the raw code.  
- Keep the code **clean, modular, and easy to refine**.  

## **Additional Features for User Experience:**  
- **Refining the Code:** Users can manually edit the generated code before rendering.  
- **Live Updates:** The preview should automatically update whenever the code is modified.  

### **Generate the optimized HTML, CSS, and JavaScript below:**  
`

    // Call Cohere API
    const response = await cohere.generate({
      prompt: formattedPrompt,
      maxTokens: 2000,
      temperature: 0.7,
      k: 0,
      stopSequences: [],
      returnLikelihoods: 'NONE',
    })
    
    // Extract generated code
    const generatedHtml = response.generations[0].text.trim()
    
    // Log usage for analytics (optional)
    await supabase.from('ai_usage').insert({
      user_id: session.user.id,
      prompt_length: prompt.length,
      response_length: generatedHtml.length,
      timestamp: new Date().toISOString(),
    })
    
    return NextResponse.json({ html: generatedHtml })
  } catch (error) {
    console.error('Error generating HTML:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate HTML code' },
      { status: 500 }
    )
  }
}
