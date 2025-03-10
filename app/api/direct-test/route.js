import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import https from 'https';
import http from 'http';

export async function POST(req) {
  console.log('[direct-test API] Request received');
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('[direct-test API] Authentication failed');
      return NextResponse.json({ error: 'You must be logged in to use this API' }, { status: 401 });
    }
    
    // Parse request body
    const { prompt, testUrl } = await req.json();
    
    if (!prompt || !testUrl) {
      console.log('[direct-test API] Missing prompt or testUrl');
      return NextResponse.json({ error: 'Prompt and testUrl are required' }, { status: 400 });
    }

    // Use Node.js http/https modules to make a direct request
    const result = await makeDirectRequest(testUrl, { prompt }, session);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[direct-test API] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function makeDirectRequest(url, body, session) {
  return new Promise((resolve, reject) => {
    // Determine if we're using http or https
    const isHttps = url.startsWith('https');
    const httpModule = isHttps ? https : http;
    
    // Parse the URL
    const urlObj = new URL(url.startsWith('http') ? url : `http://localhost:3000${url}`);
    
    // Prepare the request options
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `sb-access-token=${session?.access_token}; sb-refresh-token=${session?.refresh_token}`
      }
    };
    
    console.log(`[direct-test API] Making ${options.method} request to ${options.hostname}:${options.port}${options.path}`);
    
    // Make the request
    const req = httpModule.request(options, (res) => {
      let data = '';
      
      // Collect headers
      const headers = {};
      Object.keys(res.headers).forEach(key => {
        headers[key] = res.headers[key];
      });
      
      // Collect response data
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`[direct-test API] Response received, status: ${res.statusCode}, content-type: ${headers['content-type']}`);
        console.log(`[direct-test API] Response length: ${data.length}`);
        
        resolve({
          statusCode: res.statusCode,
          headers,
          responseText: data,
          // Diagnostic info
          diagnostic: {
            startsWithHtml: data.trim().startsWith('<!DOCTYPE') || data.trim().startsWith('<html'),
            isJsonContentType: headers['content-type']?.includes('application/json'),
            responseLength: data.length,
            firstChars: data.substring(0, 100)
          }
        });
      });
    });
    
    req.on('error', (error) => {
      console.error('[direct-test API] Request error:', error);
      reject(error);
    });
    
    // Send the request body
    req.write(JSON.stringify(body));
    req.end();
  });
}
