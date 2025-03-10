'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function ApiTestPage() {
  const [apiResponse, setApiResponse] = useState('');
  const [responseHeaders, setResponseHeaders] = useState({});
  const [prompt, setPrompt] = useState('Create a landing page about flowers');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [fetchMethod, setFetchMethod] = useState('fetch');

  const testApi = async () => {
    setIsLoading(true);
    setApiResponse('');
    setResponseHeaders({});
    setTestResult(null);
    
    try {
      console.log(`[ApiTest] Testing API with ${fetchMethod} method and prompt: ${prompt.substring(0, 50)}...`);
      
      if (fetchMethod === 'fetch') {
        // Regular fetch approach
        const response = await fetch('/api/generateHtml', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });
        
        // Collect response headers
        const headers = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        setResponseHeaders(headers);
        
        // Get raw text response
        const responseText = await response.text();
        setApiResponse(responseText);
        
        // Analyze response
        analyzeResponse(responseText, headers);
        
      } else if (fetchMethod === 'xhr') {
        // XMLHttpRequest approach
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/generateHtml');
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
          const headers = {
            'status': xhr.status,
            'content-type': xhr.getResponseHeader('content-type')
          };
          setResponseHeaders(headers);
          
          const responseText = xhr.responseText;
          setApiResponse(responseText);
          
          // Analyze response
          analyzeResponse(responseText, headers);
          setIsLoading(false);
        };
        
        xhr.onerror = function() {
          setTestResult({
            success: false,
            message: 'XHR request failed with network error'
          });
          setIsLoading(false);
        };
        
        xhr.send(JSON.stringify({ prompt }));
        return; // Early return for XHR as it's async
      } else {
        // Direct Node-style approach
        const response = await fetch('/api/direct-test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt,
            testUrl: '/api/generateHtml' 
          }),
        });
        
        const data = await response.json();
        setApiResponse(data.responseText || 'No response');
        setResponseHeaders(data.headers || {});
        
        // Analyze response
        analyzeResponse(data.responseText, data.headers);
      }
    } catch (error) {
      console.error('[ApiTest] Error testing API:', error);
      setTestResult({
        success: false,
        message: `Error: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const analyzeResponse = (responseText, headers) => {
    // Check if the content-type header indicates JSON
    const contentType = headers['content-type'] || '';
    const isJsonContentType = contentType.includes('application/json');
    
    // Try to parse as JSON
    let isValidJson = false;
    let jsonContent = null;
    
    try {
      jsonContent = JSON.parse(responseText);
      isValidJson = true;
    } catch (e) {
      isValidJson = false;
    }
    
    // Check if it looks like HTML
    const looksLikeHtml = responseText.trim().startsWith('<!DOCTYPE') || 
                          responseText.trim().startsWith('<html');
    
    // Determine if the HTML is properly wrapped in JSON
    const isHtmlInJson = isValidJson && jsonContent && 
                         typeof jsonContent.html === 'string' && 
                         (jsonContent.html.includes('<!DOCTYPE') || 
                          jsonContent.html.includes('<html'));
    
    // Generate test results
    if (isJsonContentType && isValidJson && isHtmlInJson) {
      setTestResult({
        success: true,
        message: 'Perfect! Response is valid JSON with HTML content properly wrapped in an html property.',
        details: {
          contentType: contentType,
          jsonValid: true,
          htmlInJson: true
        }
      });
    } else if (isJsonContentType && isValidJson) {
      setTestResult({
        success: true,
        message: 'Response is valid JSON but does not contain proper HTML in the html property.',
        details: {
          contentType: contentType,
          jsonValid: true,
          htmlInJson: false
        }
      });
    } else if (isJsonContentType && !isValidJson) {
      setTestResult({
        success: false,
        message: 'Content-Type claims to be JSON but the response is not valid JSON.',
        details: {
          contentType: contentType,
          jsonValid: false
        }
      });
    } else if (!isJsonContentType && looksLikeHtml) {
      setTestResult({
        success: false,
        message: 'Response is raw HTML instead of JSON. This is the likely cause of the parsing errors.',
        details: {
          contentType: contentType,
          isHtml: true
        }
      });
    } else {
      setTestResult({
        success: false,
        message: 'Response is neither valid JSON nor HTML.',
        details: {
          contentType: contentType
        }
      });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <Head>
        <title>API Test Tool</title>
      </Head>
      
      <h1>API Test Tool</h1>
      <p>This tool helps diagnose issues with the HTML generation API by showing the raw response.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Test Method:</label>
          <select 
            value={fetchMethod} 
            onChange={(e) => setFetchMethod(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px' }}
          >
            <option value="fetch">Fetch API</option>
            <option value="xhr">XMLHttpRequest</option>
            <option value="direct">Direct Server-Side (Node)</option>
          </select>
        </div>
        
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
        onClick={testApi} 
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
        {isLoading ? 'Testing...' : 'Test API'}
      </button>
      
      {testResult && (
        <div style={{ 
          margin: '20px 0', 
          padding: '12px', 
          backgroundColor: testResult.success ? '#e6f7e6' : '#ffebee', 
          color: testResult.success ? '#2e7d32' : '#c62828', 
          borderRadius: '4px',
          border: `1px solid ${testResult.success ? '#a5d6a7' : '#ef9a9a'}`
        }}>
          <h3>Test Result:</h3>
          <p>{testResult.message}</p>
          {testResult.details && (
            <pre style={{ 
              padding: '8px', 
              backgroundColor: 'rgba(0,0,0,0.05)', 
              borderRadius: '4px',
              overflow: 'auto' 
            }}>
              {JSON.stringify(testResult.details, null, 2)}
            </pre>
          )}
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h2>Response Headers</h2>
        <pre style={{ 
          padding: '16px', 
          backgroundColor: '#f5f5f5', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          {Object.keys(responseHeaders).length > 0 
            ? JSON.stringify(responseHeaders, null, 2) 
            : 'No headers received yet'}
        </pre>
      </div>
      
      <div style={{ marginTop: '20px' }}>
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
          {apiResponse ? apiResponse.substring(0, 2000) + (apiResponse.length > 2000 ? '...' : '') : 'No response yet'}
        </pre>
      </div>
    </div>
  );
}
