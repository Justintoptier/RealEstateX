import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Building2, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { mockLogin } = useAuth();

  const handleUserLogin = () => {
    // Mock login as regular user
    mockLogin({
      user_id: 'mock_user_' + Date.now(),
      name: 'John Doe',
      email: 'user@propertyhub.com',
      role: 'user',
      picture: 'https://ui-avatars.com/api/?name=John+Doe&background=fbbf24&color=000'
    });
    navigate('/dashboard');
  };

  const handleAdminLogin = () => {
    // Mock login as admin
    mockLogin({
      user_id: 'mock_admin_' + Date.now(),
      name: 'Admin User',
      email: 'admin@propertyhub.com',
      role: 'admin',
      picture: 'https://ui-avatars.com/api/?name=Admin+User&background=fbbf24&color=000'
    });
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

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleUserLogin}
            className="px-8 py-6 text-lg bg-amber-200 hover:bg-amber-300 text-black font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <User className="w-5 h-5 mr-2" />
            Login as User
          </Button>
          <Button
            onClick={handleAdminLogin}
            className="px-8 py-6 text-lg bg-transparent border-2 border-amber-200 text-amber-200 hover:bg-amber-200 hover:text-black font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Shield className="w-5 h-5 mr-2" />
            Login as Admin
          </Button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-gray-400 text-sm">
          Real Estate Management System
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
