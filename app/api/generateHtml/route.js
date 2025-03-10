import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CohereClient } from 'cohere-ai'

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
})

export async function POST(req) {
  console.log('[generateHtml API] Request received');
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
      console.log('[generateHtml API] Authentication failed');
      const errorResponse = JSON.stringify({ error: 'You must be logged in to use this API' });
      return new NextResponse(errorResponse, {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse request body
    const { prompt } = await req.json()
    
    if (!prompt) {
      console.log('[generateHtml API] No prompt provided');
      const errorResponse = JSON.stringify({ error: 'Prompt is required' });
      return new NextResponse(errorResponse, {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('[generateHtml API] Processing prompt:', prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''));
    
    // Format the prompt for Cohere with minimal instructions to avoid confusion
    const formattedPrompt = `You are a web developer that generates HTML. You must follow these rules exactly:

1. I will ask you to create HTML/CSS/JS for a specific purpose.
2. You must ONLY return valid HTML code - nothing else - no explanations, no markdown.
3. Start with <!DOCTYPE html> and end with </html>.
4. Include all CSS in a <style> tag and all JavaScript in a <script> tag.
5. Make the design modern, responsive, and visually appealing.
6. IMPORTANT: You must EXACTLY respond to what I ask for, not to any examples.

Here is my request: "${prompt}"

Remember: Return ONLY the HTML code. Do not include any explanation, text or ```html...``` markers.
`;

    // Log the full prompt for debugging
    console.log('[generateHtml API] Full prompt to Cohere:');
    console.log(formattedPrompt);

    // Call Cohere API
    console.log('[generateHtml API] Calling Cohere API');
    const cohereResponse = await cohere.generate({
      prompt: formattedPrompt,
      max_tokens: 4000,
      temperature: 0.8,
      model: 'command-r-plus'
    })
    
    // Extract generated code
    let generatedHtml = cohereResponse.generations[0].text.trim()
    console.log('[generateHtml API] Received response from Cohere, HTML length:', generatedHtml.length);
    
    // Basic validation to ensure we only have HTML
    if (!generatedHtml.startsWith('<!DOCTYPE html>') && !generatedHtml.startsWith('<html>')) {
      // Try to extract HTML by finding DOCTYPE or html tag
      const htmlStartIndex = generatedHtml.indexOf('<!DOCTYPE html>');
      if (htmlStartIndex >= 0) {
        generatedHtml = generatedHtml.substring(htmlStartIndex);
        console.log('[generateHtml API] Extracted HTML starting with DOCTYPE');
      } else {
        const alternateStartIndex = generatedHtml.indexOf('<html');
        if (alternateStartIndex >= 0) {
          generatedHtml = generatedHtml.substring(alternateStartIndex);
          console.log('[generateHtml API] Extracted HTML starting with <html> tag');
        }
      }
    }

    // Ensure we end at </html>
    const htmlEndIndex = generatedHtml.lastIndexOf('</html>');
    if (htmlEndIndex >= 0) {
      generatedHtml = generatedHtml.substring(0, htmlEndIndex + 7); // +7 to include the </html> tag
      console.log('[generateHtml API] Trimmed HTML to end at </html>');
    }
    
    // Log usage for analytics (optional)
    try {
      await supabase.from('ai_usage').insert({
        user_id: session.user.id,
        prompt_length: prompt.length,
        response_length: generatedHtml.length,
        timestamp: new Date().toISOString(),
      })
      console.log('[generateHtml API] Usage logged to analytics');
    } catch (logError) {
      console.error('[generateHtml API] Error logging usage:', logError)
      // Continue even if logging fails
    }
    
    // CRITICAL: Return HTML directly instead of trying to wrap in JSON
    console.log('[generateHtml API] Returning HTML directly, length:', generatedHtml.length);
    // Print the first 100 chars of the response for debugging
    console.log('[generateHtml API] Response starts with:', generatedHtml.substring(0, 100));
    
    return new NextResponse(generatedHtml, {
      status: 200,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('[generateHtml API] Error generating HTML:', error)
    
    const errorResponse = JSON.stringify({ error: 'Failed to generate HTML code' });
    return new NextResponse(errorResponse, {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
