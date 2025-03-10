# Project Context Implementation Plan

## Overview
This document outlines the changes needed to implement project context persistence in the HTML Code Creator app, including a "New Project" button and context-aware API routing.

## 1. ChatBox Component Modifications

### State Management
```javascript
// Add to existing state declarations in ChatBox.js
const [projectContext, setProjectContext] = useState({
  isActive: false,
  originalPrompt: '',
  projectType: '', // e.g., 'flowers', 'portfolio', etc.
  createdAt: null
});
```

### UI Enhancements
```jsx
// Replace or modify the existing ChatBox header
<div className="bg-[#0C2340] p-4 text-white flex justify-between items-center">
  <h2 className="text-lg font-bold">Chat with AI</h2>
  <button 
    onClick={handleNewProject}
    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">
    New Project
  </button>
</div>

{/* Add this below the header */}
{projectContext.isActive && (
  <div className="bg-blue-100 p-2 text-sm text-blue-800 border-b border-blue-200">
    <span className="font-medium">Current Project:</span> {projectContext.projectType.charAt(0).toUpperCase() + projectContext.projectType.slice(1)} 
    <span className="text-gray-500 text-xs ml-2">
      (started {new Date(projectContext.createdAt).toLocaleTimeString()})
    </span>
  </div>
)}
```

### Project Management Functions
```javascript
// Add this function to ChatBox component
const handleNewProject = () => {
  // If in an active project, confirm before resetting
  if (projectContext.isActive) {
    if (!confirm("Start a new project? This will clear your current chat history.")) {
      return;
    }
  }
  
  // Reset project context
  setProjectContext({
    isActive: false,
    originalPrompt: '',
    projectType: '',
    createdAt: null
  });
  
  // Clear messages
  setMessages([{
    role: 'assistant',
    content: 'Ready to start a new project! What would you like me to create?'
  }]);
  
  // Clear HTML preview if callback exists
  if (onHtmlGenerated && typeof onHtmlGenerated === 'function') {
    onHtmlGenerated(''); // Clear the preview
  }
};

// Project type detection function
const detectProjectType = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('flower') || 
      lowerPrompt.includes('floral') || 
      lowerPrompt.includes('garden')) {
    return 'flowers';
  }
  
  if (lowerPrompt.includes('portfolio') || 
      lowerPrompt.includes('resume') || 
      lowerPrompt.includes('cv')) {
    return 'portfolio';
  }
  
  if (lowerPrompt.includes('restaurant') || 
      lowerPrompt.includes('cafe') || 
      lowerPrompt.includes('menu')) {
    return 'restaurant';
  }
  
  // Default project type
  return 'generic';
};
```

### Update Message Submit Handler
```javascript
// Modify the existing onSubmit function
const onSubmit = async (data) => {
  try {
    const message = data.message.trim();
    if (!message) return;
    
    // Add message to chat
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'user', content: message }
    ]);
    
    reset();
    
    // Check if this is a new project request
    if (!projectContext.isActive) {
      const projectType = detectProjectType(message);
      setProjectContext({
        isActive: true,
        originalPrompt: message,
        projectType: projectType,
        createdAt: new Date().toISOString()
      });
      console.log(`[ChatBox] New project started: ${projectType}`);
    }
    
    // Process message and generate HTML
    await generateHtml(message);
  } catch (error) {
    console.error('[ChatBox] Error in onSubmit:', error);
    // Error handling
  }
};
```

## 2. Update generateHtml Function
```javascript
// Modify the existing generateHtml function
const generateHtml = async (message) => {
  try {
    setIsLoading(true);
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'assistant', content: 'Generating HTML...' }
    ]);

    // Create a fallback HTML response in case everything else fails
    const fallbackHtml = `<!DOCTYPE html>...`; // existing fallback HTML
    
    console.log('[ChatBox] Generating HTML with prompt:', message.substring(0, 50) + '...');
    
    // Check authentication before making the API call
    const authResponse = await fetch('/api/auth/check');
    if (!authResponse.ok) {
      // Handle auth failure as before
      // ...
      return { success: false, error: 'Authentication required' };
    }
    
    // Determine which API endpoint to use based on project context
    let apiEndpoint;
    
    if (projectContext.projectType === 'flowers') {
      apiEndpoint = '/api/hardcoded-flowers';
    } else {
      apiEndpoint = '/api/generateHtml';
    }
    
    console.log(`[ChatBox] Using API endpoint: ${apiEndpoint} (projectType: ${projectContext.projectType})`);
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/html'
      },
      body: JSON.stringify({ 
        prompt: message,
        projectContext: {
          isModification: projectContext.isActive && projectContext.originalPrompt !== message,
          originalPrompt: projectContext.originalPrompt,
          projectType: projectContext.projectType
        }
      }),
    });
    
    // Remaining code for handling the response
    // ...
  } catch (error) {
    // Error handling
    // ...
  } finally {
    setIsLoading(false);
  }
};
```

## 3. Local Storage Integration (Optional)
```javascript
// Add these useEffect hooks to ChatBox component

// Save context to localStorage when it changes
useEffect(() => {
  if (projectContext.isActive) {
    localStorage.setItem('htmlCreator_projectContext', JSON.stringify(projectContext));
  } else {
    localStorage.removeItem('htmlCreator_projectContext');
  }
}, [projectContext]);

// Load context on component mount
useEffect(() => {
  const savedContext = localStorage.getItem('htmlCreator_projectContext');
  if (savedContext) {
    try {
      const parsed = JSON.parse(savedContext);
      setProjectContext(parsed);
      
      // Optionally add a message indicating the project was restored
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'assistant', 
          content: `I've restored your previous ${parsed.projectType} project. You can continue making modifications or start a new project using the button above.` 
        }
      ]);
    } catch (e) {
      console.error('Failed to parse saved project context', e);
    }
  }
}, []);
```

## 4. Update API Handlers
The `/api/generateHtml/route.js` file should be updated to handle the project context:

```javascript
// In /api/generateHtml/route.js
export async function POST(req) {
  try {
    const { prompt, projectContext } = await req.json();
    
    // Log the project context
    console.log('[API] Project context:', projectContext);
    
    // If this is a modification request, adjust the prompt
    let effectivePrompt = prompt;
    if (projectContext && projectContext.isModification) {
      effectivePrompt = `The user previously asked to create: "${projectContext.originalPrompt}". Now they want to modify it with this request: "${prompt}". Make the requested changes while preserving the original structure and purpose.`;
    }
    
    // Proceed with the AI generation using effectivePrompt
    // ...
  } catch (error) {
    // Error handling
    // ...
  }
}
```

## 5. Making Changes to Hardcoded API Endpoints
For specialized endpoints like `/api/hardcoded-flowers/route.js`, updates may be needed to handle modifications:

```javascript
// In /api/hardcoded-flowers/route.js
export async function POST(req) {
  try {
    const { prompt, projectContext } = await req.json();
    
    console.log('[hardcoded-flowers API] Request received');
    console.log('[hardcoded-flowers API] Project context:', projectContext);
    
    // Basic modification detection - not perfect but provides some context
    const isModification = projectContext && projectContext.isModification;
    
    if (isModification) {
      console.log('[hardcoded-flowers API] This is a modification request');
      // For now, we're just returning the same hardcoded HTML
      // In a real implementation, you would either:
      // 1. Have multiple variations of the hardcoded HTML for common modifications
      // 2. Use the AI to modify the hardcoded HTML based on the request
    }
    
    // Return the hardcoded HTML as before
    // ...
  } catch (error) {
    // Error handling
    // ...
  }
}
```

## Implementation Strategy
1. Start with modifying the ChatBox component to add the project context state and UI
2. Add the New Project button and its handler function
3. Update the message processing logic to detect project types
4. Modify the API call to include project context information
5. Test the basic functionality with the hardcoded flowers API
6. Implement localStorage persistence if desired
7. Extend to other project types as needed
