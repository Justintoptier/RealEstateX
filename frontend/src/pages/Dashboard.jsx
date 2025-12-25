import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Search, Upload, Building2, LogOut, Users } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-amber-200" strokeWidth={1.5} />
            <span className="text-2xl font-serif text-white">MAK Kotwal Venus</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-white font-medium">{user?.name || 'User'}</p>
              <p className="text-amber-200 text-sm">{user?.role || 'user'}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-amber-200 text-amber-200 hover:bg-amber-200 hover:text-black transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-white mb-4">
            What would you like to do?
          </h1>
          <p className="text-gray-400 text-lg">
            Search through our property database or upload new listings
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Search Properties Card */}
          <Card 
            className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-200/10 hover:-translate-y-1 cursor-pointer group"
            onClick={() => navigate('/search')}
          >
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-amber-200/10 flex items-center justify-center mb-4 group-hover:bg-amber-200/20 transition-colors duration-300">
                <Search className="w-8 h-8 text-amber-200" />
              </div>
              <CardTitle className="text-2xl text-white font-serif">Search Properties</CardTitle>
              <CardDescription className="text-gray-400 text-base mt-2">
                Browse and filter available properties with advanced search options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-transparent border-2 border-amber-200 text-amber-200 hover:bg-amber-200 hover:text-black transition-all duration-300"
              >
                Start Searching
              </Button>
            </CardContent>
          </Card>

          {/* Upload Property Card */}
          <Card 
            className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-200/10 hover:-translate-y-1 cursor-pointer group"
            onClick={() => navigate('/upload')}
          >
            <CardHeader>
              <div className="w-16 h-16 rounded-lg bg-amber-200/10 flex items-center justify-center mb-4 group-hover:bg-amber-200/20 transition-colors duration-300">
                <Upload className="w-8 h-8 text-amber-200" />
              </div>
              <CardTitle className="text-2xl text-white font-serif">Upload Property</CardTitle>
              <CardDescription className="text-gray-400 text-base mt-2">
                Add new properties manually{user?.role === 'admin' ? ' or bulk upload via Excel' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-transparent border-2 border-amber-200 text-amber-200 hover:bg-amber-200 hover:text-black transition-all duration-300"
              >
                Upload Property
              </Button>
            </CardContent>
          </Card>

          {/* User Management Card - Admin Only */}
          {user?.role === 'admin' && (
            <Card 
              className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-200/10 hover:-translate-y-1 cursor-pointer group"
              onClick={() => navigate('/users')}
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-lg bg-amber-200/10 flex items-center justify-center mb-4 group-hover:bg-amber-200/20 transition-colors duration-300">
                  <Users className="w-8 h-8 text-amber-200" />
                </div>
                <CardTitle className="text-2xl text-white font-serif">Manage Users</CardTitle>
                <CardDescription className="text-gray-400 text-base mt-2">
                  Add, remove users and manage permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-transparent border-2 border-amber-200 text-amber-200 hover:bg-amber-200 hover:text-black transition-all duration-300"
                >
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
