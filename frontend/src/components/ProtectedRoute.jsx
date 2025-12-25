import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If user data was passed from AuthCallback, skip additional checks
    if (location.state?.user) {
      setIsReady(true);
      return;
    }

    // Wait for auth check to complete
    if (!loading) {
      setIsReady(true);
    }
  }, [loading, location.state]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !location.state?.user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
