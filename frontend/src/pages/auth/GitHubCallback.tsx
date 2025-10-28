import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleOAuthCallback } from '../../utils/oauth';
import { authApi } from '../../api/auth';

const GitHubCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        console.log('=== GitHub OAuth Callback ===');
        console.log('Current URL:', window.location.href);
        
        const searchParams = new URLSearchParams(window.location.search);
        console.log('Search params:', Object.fromEntries(searchParams));
        
        const { code } = await handleOAuthCallback('github', searchParams);
        console.log('Got code:', code);

        if (code) {
          console.log('Sending code to backend...');
          const response = await authApi.socialLogin({
            provider: 'github',
            code,
          });
          
          console.log('Backend response:', response);

          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          
          console.log('Tokens saved, navigating to workspaces...');
          
          // Force a page reload to reinitialize the AuthContext with the new user
          window.location.href = '/workspaces';
        }
      } catch (err: any) {
        console.error('GitHub callback error:', err);
        console.error('Error response:', err.response?.data);
        setError(err.response?.data?.error || err.message || 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-[#172B4D] mb-4">Authentication Error</h2>
          <p className="text-[#DE350B] mb-4">{error}</p>
          <p className="text-[#5E6C84]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0052CC] mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-[#172B4D] mb-2">Authenticating with GitHub...</h2>
        <p className="text-[#5E6C84]">Please wait...</p>
      </div>
    </div>
  );
};

export default GitHubCallback;
