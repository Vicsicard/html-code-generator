'use client';

import { useState, useEffect, useRef } from 'react';

export default function DirectTestPage() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('Create a landing page about flowers');
  const [apiResponse, setApiResponse] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const iframeRef = useRef(null);

  // Call API using XMLHttpRequest to ensure we get the raw response
  const generateHtml = () => {
    setIsLoading(true);
    setErrorMessage('');
    console.log('Sending request with prompt:', prompt);
    
    // Create a fallback HTML in case all else fails
    const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fallback HTML</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <h1>Fallback Content</h1>
  <p>This is a fallback message created when API processing encountered an error.</p>
  <p>Your request was: "${prompt.replace(/"/g, '&quot;')}"</p>
</body>
</html>`;
    
    // Use XMLHttpRequest to avoid automatic JSON parsing
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/hardcoded-flowers');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'text/html');
    
    xhr.onload = function() {
      console.log('Response status:', xhr.status);
      console.log('Response content-type:', xhr.getResponseHeader('content-type'));
      
      const responseText = xhr.responseText;
      setApiResponse(responseText);
      
      console.log('Response text (first 100 chars):', responseText.substring(0, 100));
      
      // Check if the response is HTML (which is what we expect now)
      if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
        console.log('Response is HTML as expected');
        setHtmlContent(responseText);
      } else {
        // As a fallback, try to parse as JSON
        try {
          const jsonData = JSON.parse(responseText);
          console.log('Unexpectedly received JSON response');
          
          if (jsonData.html) {
            setHtmlContent(jsonData.html);
            console.log('Found HTML in JSON response');
          } else {
            throw new Error('No HTML property in JSON response');
          }
        } catch (jsonError) {
          console.error('Response is neither valid HTML nor JSON:', jsonError);
          setErrorMessage('Could not parse API response as HTML or JSON');
          // Use fallback
          setHtmlContent(fallbackHtml);
        }
      }
      
      setIsLoading(false);
    };
    
    xhr.onerror = function() {
      console.error('Network error occurred');
      setErrorMessage('Network error occurred');
      setHtmlContent(fallbackHtml);
      setIsLoading(false);
    };
    
    xhr.send(JSON.stringify({ prompt }));
  };

  const updateIframe = () => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
    }
  };

  // Update iframe when HTML content changes
  useEffect(() => {
    updateIframe();
  }, [htmlContent]);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Direct HTML Testing Tool</h1>
      <p>This tool bypasses the automatic JSON parsing to diagnose API response issues.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="prompt" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Prompt:
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', minHeight: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      
      <button 
        onClick={generateHtml} 
        disabled={isLoading}
        style={{
          padding: '10px 16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? 'Generating...' : 'Generate HTML'}
      </button>
      
      {errorMessage && (
        <div style={{ margin: '20px 0', padding: '12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          {errorMessage}
        </div>
      )}
      
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h2>Raw API Response</h2>
          <pre style={{ 
            padding: '16px', 
            backgroundColor: '#f5f5f5', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {apiResponse ? apiResponse.substring(0, 1000) + (apiResponse.length > 1000 ? '...' : '') : 'No response yet'}
          </pre>
        </div>
        
        <div>
          <h2>Preview</h2>
          <div style={{ 
            height: '500px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <iframe
              ref={iframeRef}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="HTML Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
