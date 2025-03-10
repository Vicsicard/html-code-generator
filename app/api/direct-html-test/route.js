import { NextResponse } from 'next/server'
import { CohereClient } from 'cohere-ai'

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
})

export async function POST(req) {
  console.log('[direct-html-test API] Request received');
  try {
    // Parse request body
    const { prompt } = await req.json()
    
    if (!prompt) {
      console.log('[direct-html-test API] No prompt provided');
      return new NextResponse('Prompt is required', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    console.log('[direct-html-test API] Processing prompt:', prompt);
    
    // Extremely simple prompt format - no examples, no confusion
    const formattedPrompt = `Generate HTML for: "${prompt}".
Create ONLY plain HTML (with CSS and JS). 
Start with <!DOCTYPE html> and end with </html>.
NO markdown, NO comments outside the HTML, ONLY the HTML code.`;

    // Log the actual prompt being sent
    console.log('[direct-html-test API] Sending prompt to Cohere:', formattedPrompt);
    
    // Call Cohere API with very simple settings
    const cohereResponse = await cohere.generate({
      prompt: formattedPrompt,
      max_tokens: 4000,
      temperature: 0.7,
      model: 'command-r-plus'
    })
    
    // Get the generated text
    let generatedHtml = cohereResponse.generations[0].text;
    console.log('[direct-html-test API] Raw response length:', generatedHtml.length);
    
    // Ensure we start at <!DOCTYPE html>
    const htmlStartIndex = generatedHtml.indexOf('<!DOCTYPE html>');
    if (htmlStartIndex >= 0) {
      generatedHtml = generatedHtml.substring(htmlStartIndex);
      console.log('[direct-html-test API] Trimmed HTML to start at DOCTYPE');
    }
    
    // Ensure we end at </html>
    const htmlEndIndex = generatedHtml.lastIndexOf('</html>');
    if (htmlEndIndex >= 0) {
      generatedHtml = generatedHtml.substring(0, htmlEndIndex + 7); // +7 to include the </html> tag
      console.log('[direct-html-test API] Trimmed HTML to end at </html>');
    }
    
    // Return HTML directly
    console.log('[direct-html-test API] Returning HTML, length:', generatedHtml.length);
    console.log('[direct-html-test API] First 100 chars:', generatedHtml.substring(0, 100));
    
    return new NextResponse(generatedHtml, {
      status: 200,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('[direct-html-test API] Error:', error);
    return new NextResponse('Error generating HTML: ' + error.message, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
