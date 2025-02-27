import { useEffect } from 'react';
import Head from 'next/head';

export default function Pricing() {
  useEffect(() => {
    // Redirect to app/pricing if running in browser
    if (typeof window !== 'undefined') {
      window.location.href = '/app/pricing';
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
        <title>Pricing | HTML Code Creator</title>
        <meta name="description" content="HTML Code Creator Pricing Plans" />
      </Head>

      <main>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Loading Pricing Information...</h1>
        <p>Please wait while we redirect you to the pricing page</p>
      </main>
    </div>
  );
}
