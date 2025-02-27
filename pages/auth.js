import { useEffect } from 'react';
import Head from 'next/head';

export default function Auth() {
  useEffect(() => {
    // Redirect to app/auth if running in browser
    if (typeof window !== 'undefined') {
      window.location.href = '/app/auth';
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
        <title>Authentication | HTML Code Creator</title>
        <meta name="description" content="Sign in to HTML Code Creator" />
      </Head>

      <main>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading Authentication...</h1>
        <p>Please wait while we redirect you to the login page</p>
      </main>
    </div>
  );
}
