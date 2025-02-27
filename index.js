// Simple static server
const { createServer } = require('http');
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const server = createServer((req, res) => {
  try {
    let path = req.url;
    
    // Default to index.html
    if (path === '/') {
      path = '/index.html';
    }
    
    // Remove query parameters
    const queryIndex = path.indexOf('?');
    if (queryIndex !== -1) {
      path = path.substring(0, queryIndex);
    }
    
    // Try to find the file
    const filePath = join(__dirname, 'public', path);
    
    if (existsSync(filePath)) {
      // Determine content type
      let contentType = 'text/html';
      if (path.endsWith('.css')) contentType = 'text/css';
      if (path.endsWith('.js')) contentType = 'text/javascript';
      if (path.endsWith('.json')) contentType = 'application/json';
      if (path.endsWith('.png')) contentType = 'image/png';
      if (path.endsWith('.jpg') || path.endsWith('.jpeg')) contentType = 'image/jpeg';
      
      const content = readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } else {
      // Serve index.html for everything else (SPA behavior)
      const content = readFileSync(join(__dirname, 'public', 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
