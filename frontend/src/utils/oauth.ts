export const OAUTH_CONFIG = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    redirectUri: `${window.location.origin}/auth/callback/google`,
    scope: 'openid email profile',
  },
  github: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
    authUrl: 'https://github.com/login/oauth/authorize',
    redirectUri: `${window.location.origin}/auth/callback/github`,
    scope: 'read:user user:email',
  },
};

export const initiateOAuthLogin = (provider: 'google' | 'github') => {
  const config = OAUTH_CONFIG[provider];
  
  if (!config.clientId) {
    console.error(`${provider} client ID is not configured`);
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth is not configured. Please check your .env file.`);
    return;
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: provider === 'google' ? 'token' : 'code',
  });

  if (provider === 'google') {
    params.append('include_granted_scopes', 'true');
  }

  const authUrl = `${config.authUrl}?${params.toString()}`;
  window.location.href = authUrl;
};

export const handleOAuthCallback = async (
  provider: 'google' | 'github',
  searchParams: URLSearchParams
) => {
  if (provider === 'google') {
    // Google returns token in hash fragment
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (!accessToken) {
      throw new Error('No access token received from Google');
    }
    
    return { token: accessToken };
  } else if (provider === 'github') {
    // GitHub returns code in query params
    const code = searchParams.get('code');
    
    if (!code) {
      throw new Error('No authorization code received from GitHub');
    }
    
    return { code };
  }
  
  throw new Error('Unsupported provider');
};
