import * as React from 'react';

const SimpleAuthForm = ({ onAuthSuccess }) => {
  console.log('SimpleAuthForm component rendered');
  
  const handleQuickLogin = () => {
    console.log('Quick login clicked');
    onAuthSuccess({
      id: 'demo_user',
      username: 'demo_user',
      display_name: 'Demo User',
      email: 'demo@example.com',
      wallet_address: 'demo_wallet'
    });
  };

  const handleGuestLogin = () => {
    console.log('Guest login clicked');
    onAuthSuccess({
      id: 'guest',
      username: 'guest',
      display_name: 'Guest User',
      email: 'guest@demo.com',
      wallet_address: 'guest_wallet'
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e293b', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'black', marginBottom: '20px' }}>Social Media Hub</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Choose your access method</p>
        
        <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
          <button 
            onClick={handleQuickLogin}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Quick Login (Demo)
          </button>
          
          <button 
            onClick={handleGuestLogin}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Guest Access
          </button>
        </div>
        
        <p style={{ color: '#999', fontSize: '14px', marginTop: '20px' }}>
          Demo credentials: demo@example.com / demo123
        </p>
      </div>
    </div>
  );
};

export default SimpleAuthForm;