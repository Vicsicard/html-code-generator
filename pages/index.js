import { useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  useEffect(() => {
    // Redirect to app directory home if running in browser
    if (typeof window !== 'undefined') {
      window.location.href = '/app';
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#0C2340',
      color: 'white',
      textAlign: 'center',
      padding: '1rem'
    }}>
      <Head>
        <title>HTML Code Creator</title>
        <meta name="description" content="AI-Powered HTML Generation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>HTML Code Creator</h1>
        <p style={{ marginBottom: '2rem' }}>Effortlessly create beautiful, responsive HTML code with the power of AI</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a 
            href="/auth"
            style={{
              backgroundColor: '#F47920',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              textTransform: 'uppercase'
            }}
          >
            Get Started
          </a>
          <a
            href="/pricing"
            style={{
              backgroundColor: 'white',
              color: '#0C2340',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              textTransform: 'uppercase'
            }}
          >
            View Pricing
          </a>
        </div>
      </main>
    </div>
  );
}
