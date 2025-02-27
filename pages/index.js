import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LegacyHomePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the app directory home page
    router.replace('/');
  }, [router]);
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#0C2340',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>HTML Code Creator</h1>
        <p>Loading your experience...</p>
      </div>
    </div>
  );
}
