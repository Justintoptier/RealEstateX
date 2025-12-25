import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Building2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('login');
  const [step, setStep] = useState('credentials'); // credentials, 2fa
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [otpCode, setOtpCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateOTP = () => {
    // Generate a simple 6-digit OTP for demo
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const generate2FASecret = () => {
    // Generate a simple secret for demo (in production, use proper library)
    return 'MAKV' + Math.random().toString(36).substring(2, 15).toUpperCase();
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Call backend to init 2FA
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/init-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          role: formData.role
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initialize 2FA');
      }

      const data = await response.json();
      
      // Store temp token for verification
      sessionStorage.setItem('temp_token', data.temp_token);
      
      // Generate QR code URL from totp_uri
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.totp_uri)}`;
      
      setQrCodeUrl(qrUrl);
      setSecret(data.secret);
      setStep('2fa');

      // For demo purposes, show the OTP
      toast({
        title: 'Demo Mode',
        description: `For testing, use OTP: ${data.demo_otp}`,
        variant: 'default',
        duration: 10000
      });
    } catch (error) {
      console.error('2FA init error:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize 2FA. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();

    try {
      const tempToken = sessionStorage.getItem('temp_token');
      
      if (!tempToken) {
        throw new Error('Session expired. Please try again.');
      }

      // Verify OTP with backend
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          temp_token: tempToken,
          otp_code: otpCode
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Verification failed');
      }

      const userData = await response.json();
      
      // Clean up
      sessionStorage.removeItem('temp_token');
      onLogin(userData);
      
      toast({
        title: 'Success',
        description: '2FA verification successful!',
        variant: 'default'
      });

      // Reset form
      setFormData({ username: '', email: '', password: '', role: 'user' });
      setOtpCode('');
      setStep('credentials');
      onClose();
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP code. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Building2 className="w-12 h-12 text-amber-200" />
          </div>
          <DialogTitle className="text-2xl font-serif text-center text-white">
            {step === 'credentials' ? 'Welcome to MAK Kotwal Venus' : '2FA Verification'}
          </DialogTitle>
        </DialogHeader>

        {step === 'credentials' ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-gray-800">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-amber-200 data-[state=active]:text-black"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-amber-200 data-[state=active]:text-black"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleCredentialsSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="login-username" className="text-gray-300">Username</Label>
                  <Input
                    id="login-username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    required
                    className="bg-black/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="bg-black/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Login As</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={formData.role === 'user'}
                        onChange={handleInputChange}
                        className="text-amber-200"
                      />
                      User
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={handleInputChange}
                        className="text-amber-200"
                      />
                      Admin
                    </label>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-amber-200 hover:bg-amber-300 text-black font-medium"
                >
                  Continue
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full border-gray-700 text-white hover:bg-gray-800"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleCredentialsSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="signup-username" className="text-gray-300">Username</Label>
                  <Input
                    id="signup-username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Choose a username"
                    required
                    className="bg-black/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="bg-black/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    required
                    className="bg-black/50 border-gray-700 text-white mt-2"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-amber-200 hover:bg-amber-300 text-black font-medium"
                >
                  Sign Up
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full border-gray-700 text-white hover:bg-gray-800"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6 mt-4">
            <div className="text-center">
              <p className="text-gray-400 mb-4">
                Scan this QR code with your authenticator app
              </p>
              <div className="bg-white p-4 rounded-lg inline-block">
                <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Or manually enter: {secret}
              </p>
            </div>

            <form onSubmit={handleOTPVerification} className="space-y-4">
              <div>
                <Label htmlFor="otp" className="text-gray-300">Enter 6-digit OTP</Label>
                <Input
                  id="otp"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  required
                  className="bg-black/50 border-gray-700 text-white text-center text-2xl tracking-widest mt-2"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-amber-200 hover:bg-amber-300 text-black font-medium"
              >
                Verify & Login
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setOtpCode('');
                }}
                variant="outline"
                className="w-full border-gray-700 text-white hover:bg-gray-800"
              >
                Back
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
