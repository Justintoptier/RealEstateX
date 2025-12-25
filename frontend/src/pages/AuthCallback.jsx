import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          throw new Error('No session ID found');
        }

        // Exchange session_id for user data
        const response = await fetch(
          'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data',
          {
            headers: {
              'X-Session-ID': sessionId
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to get session data');
        }

        const data = await response.json();

        // Send session_token to backend to create session
        const backendResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/session`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              session_token: data.session_token,
              email: data.email,
              name: data.name,
              picture: data.picture
            })
          }
        );

        if (!backendResponse.ok) {
          throw new Error('Failed to create session');
        }

        const userData = await backendResponse.json();
        
        // Update auth context
        login(userData);

        // Redirect to dashboard
        navigate('/dashboard', { replace: true, state: { user: userData } });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/', { replace: true });
      }
    };

    processSession();
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-200 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-300 text-lg">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
