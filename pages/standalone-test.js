// This page completely bypasses the Next.js app directory and layout system
// It should be immune to any layout.js errors

export default function StandaloneTest() {
  const generateHtml = async () => {
    try {
      const response = await fetch('/api/hardcoded-flowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/html'
        },
        body: JSON.stringify({ prompt: 'Create a landing page about flowers' }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      console.log('Response content-type:', contentType);

      const htmlContent = await response.text();
      console.log('HTML received (first 100 chars):', htmlContent.substring(0, 100));
      
      // Display the HTML in the iframe
      const iframe = document.getElementById('preview-iframe');
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      document.getElementById('status').textContent = 'HTML generated successfully!';
    } catch (error) {
      console.error('Error generating HTML:', error);
      document.getElementById('status').textContent = `Error: ${error.message}`;
    }
  };

  return (
    <html>
      <head>
        <title>Standalone HTML Test</title>
        <style jsx>{`
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
          }
          button {
            background: #0070f3;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            margin: 20px 0;
          }
          button:hover {
            background: #0060df;
          }
          .preview {
            border: 1px solid #ddd;
            border-radius: 4px;
            height: 600px;
            width: 100%;
          }
          #status {
            margin: 20px 0;
            padding: 10px;
            border-radius: 4px;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>Standalone HTML Generation Test</h1>
          <p>This page bypasses the Next.js app directory and layout system.</p>
          
          <button onClick={generateHtml}>
            Generate Flowers HTML
          </button>
          
          <div id="status" style={{ background: '#f0f9ff', color: '#0070f3' }}>
            Click the button to generate HTML
          </div>
          
          <h2>Preview:</h2>
          <iframe id="preview-iframe" className="preview" title="HTML Preview"></iframe>
        </div>
      </body>
    </html>
  );
}
