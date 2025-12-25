import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const { mockLogin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = (userData) => {
    mockLogin(userData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1581784878214-8d5596b98a01?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvcnxlbnwwfHx8fDE3NjY2NTE4MDF8MA&ixlib=rb-4.1.0&q=85)'
        }}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo Icon */}
        <div className="mb-8">
          <Building2 className="w-20 h-20 text-amber-200" strokeWidth={1.5} />
        </div>

        {/* Brand Title */}
        <h1 className="text-6xl md:text-7xl font-serif text-white mb-4 tracking-wide">
          MAK Kotwal Venus
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl mb-12 text-center max-w-2xl">
          Your comprehensive real estate property management solution
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => setShowAuthModal(true)}
          className="px-12 py-6 text-lg bg-amber-200 hover:bg-amber-300 text-black font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          Get Started
        </Button>

        {/* Footer */}
        <div className="absolute bottom-8 text-gray-400 text-sm">
          Real Estate Management System
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default LandingPage;
