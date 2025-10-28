import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../../utils/oauth';
import { authApi } from '../../api/auth';
import '../../styles/Auth.css';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const { token } = await handleOAuthCallback('google', searchParams);

        if (token) {
          const response = await authApi.socialLogin({
            provider: 'google',
            token,
          });

          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          
          // Force a page reload to reinitialize the AuthContext with the new user
          window.location.href = '/workspaces';
        }
      } catch (err: any) {
        console.error('Google callback error:', err);
        setError(err.message || 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Authentication Error</h2>
          <p className="error-message">{error}</p>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Authenticating with Google...</h2>
        <div className="loading">Please wait...</div>
      </div>
    </div>
  );
};

export default GoogleCallback;
