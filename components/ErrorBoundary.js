'use client'

import React from 'react'

// Helper to standardize errors
const createStandardError = (context, error, componentStack = null) => {
  // If error is a string, convert to Error object
  if (typeof error === 'string') {
    return {
      name: 'Error',
      message: error,
      context,
      stack: new Error(error).stack,
      componentStack,
      timestamp: new Date().toISOString()
    };
  }
  
  // If error is already an Error object or similar, ensure it has all needed properties
  return {
    name: error?.name || 'Error',
    message: error?.message || String(error) || 'Unknown error',
    context,
    stack: error?.stack || new Error().stack,
    componentStack,
    timestamp: new Date().toISOString(),
    originalError: error // Keep the original error for reference
  };
};

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Create standardized error
    const standardError = createStandardError(
      'error_boundary',
      error,
      errorInfo?.componentStack || null
    );
    
    // Log error details with standardized format
    console.group('=== ErrorBoundary Caught Error ===');
    console.error('Error details:', {
      name: standardError.name,
      message: standardError.message,
      stack: standardError.stack,
      componentStack: standardError.componentStack
    });
    console.groupEnd();
    
    // Update state with error details
    this.setState({ 
      errorInfo,
      error: standardError
    });
    
    // Call the onError prop if it exists
    if (this.props.onError && typeof this.props.onError === 'function') {
      try {
        this.props.onError(standardError);
      } catch (callbackError) {
        console.error('Error in ErrorBoundary.onError callback:', {
          message: callbackError?.message || 'Unknown callback error',
          stack: callbackError?.stack
        });
      }
    }
  }
  
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    if (this.props.onReset && typeof this.props.onReset === 'function') {
      try {
        this.props.onReset();
      } catch (resetError) {
        console.error('Error in ErrorBoundary.onReset callback:', {
          message: resetError?.message || 'Unknown reset error',
          stack: resetError?.stack
        });
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      const errorName = this.state.error?.name || 'Error';
      const errorMessage = this.state.error?.message || 'An unknown error occurred';
      const componentStack = this.state.errorInfo?.componentStack;
      
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return React.createElement(this.props.fallback, {
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          reset: this.handleReset
        });
      }
      
      // Otherwise, render a default fallback UI
      return (
        <div className="error-boundary bg-red-800 text-white p-6 rounded-lg shadow-lg max-w-full overflow-hidden mx-auto my-4">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h2 className="text-xl font-bold">Component Error</h2>
          </div>
          
          <div className="mb-4">
            <p className="font-bold text-lg text-red-300">{errorName}</p>
            <p className="text-white">{errorMessage}</p>
          </div>
          
          {componentStack && (
            <details className="mb-4">
              <summary className="cursor-pointer font-semibold text-sm mb-2 text-red-300 hover:text-white">
                Component Stack Trace
              </summary>
              <pre className="text-xs bg-red-900 p-3 rounded overflow-auto max-h-40 whitespace-pre-wrap">
                {componentStack}
              </pre>
            </details>
          )}
          
          <div className="flex space-x-4">
            <button
              onClick={this.handleReset}
              className="bg-white text-red-900 px-4 py-2 rounded font-bold hover:bg-red-100 transition-colors"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-red-700 text-white px-4 py-2 rounded font-bold hover:bg-red-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}
