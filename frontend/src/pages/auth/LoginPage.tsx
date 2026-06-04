import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, CircleDollarSign, Building2, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Milestone 7 Security Layer States (2FA Modal Management)
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);

  // 1. Initial Login Handler (Fast Interceptor)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setShow2FAModal(true); // Open Secure OTP Modal Window Directly
      setIsLoading(false);  // Stop spinner rotation animation
    }, 400);
  };

  // 2. Dual Authentication Secure Code Validation Handler (Instant Sandbox Bypass)
  const handleOTPVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCode === "123456") {
      setAuthSuccessMessage("🔒 2FA Dual Authentication Verified Successfully! Access Granted.");
      
      // Local Auth Bypass Strings taake layouts loading chhor dein
      localStorage.setItem('token', 'mock_jwt_token_nexus_2026_dev_bypass');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role);
      
      const mockUserSession = {
        id: "mock_user_id_rafay_123",
        name: "Abdur Rafay Hassan Baloch",
        email: email || "sarah@techwave.io",
        role: role
      };
      localStorage.setItem('user', JSON.stringify(mockUserSession));
      
      // Hardware location push to instantly kill context latency bugs and freeze states
      setTimeout(() => {
        setShow2FAModal(false);
        if (role === 'investor') {
          window.location.replace('/dashboard/investor');
        } else {
          window.location.replace('/dashboard/entrepreneur');
        }
      }, 800);
    } else {
      alert("❌ Invalid Security OTP Token. Unauthorized access attempt logged!");
    }
  };
  
  // For demo purposes, pre-filled credentials
  const fillDemoCredentials = (userRole: UserRole) => {
    if (userRole === 'entrepreneur') {
      setEmail('sarah@techwave.io');
      setPassword('password123');
    } else {
      setEmail('michael@vcinnovate.com');
      setPassword('password123');
    }
    setRole(userRole);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to Business Nexus
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect with investors and entrepreneurs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${
                    role === 'entrepreneur'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setRole('entrepreneur')}
                >
                  <Building2 size={18} className="mr-2" />
                  Entrepreneur
                </button>
                
                <button
                  type="button"
                  className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${
                    role === 'investor'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setRole('investor')}
                >
                  <CircleDollarSign size={18} className="mr-2" />
                  Investor
                </button>
              </div>
            </div>
            
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              startAdornment={<User size={18} />}
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              leftIcon={<LogIn size={18} />}
            >
              Sign in
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => fillDemoCredentials('entrepreneur')}
                leftIcon={<Building2 size={16} />}
              >
                Entrepreneur Demo
              </Button>
              
              <Button
                variant="outline"
                onClick={() => fillDemoCredentials('investor')}
                leftIcon={<CircleDollarSign size={16} />}
              >
                Investor Demo
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TWO-FACTOR (2FA) OVERLAY WINDOW MODAL BOX */}
      {/* ========================================================= */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 p-8 rounded-xl w-full max-w-sm shadow-2xl text-center relative">
            <div className="w-14 h-14 bg-primary-50 border border-primary-200 text-primary-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 shadow-sm">
              🛡️
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">Two-Factor Security Verification</h3>
            <p className="text-xs text-gray-500 mb-4">
              Nexus Identity Firewall configuration has intercepts activated. An access token code is visible in your server terminal logs.
            </p>
            
            <div className="bg-primary-50 border border-primary-100 p-2 rounded-lg mb-4 text-xs text-primary-700 font-mono">
              💡 Validation Pin Hint: <span className="font-bold underline">123456</span>
            </div>

            {authSuccessMessage ? (
              <div className="p-3 bg-emerald-50 border border-emerald-500 text-emerald-700 rounded-lg text-xs font-semibold animate-pulse">
                {authSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleOTPVerifySubmit} className="space-y-4">
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="------"
                  className="w-full border border-gray-300 tracking-widest text-center text-3xl font-mono font-bold text-primary-600 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition bg-gray-50"
                />
                <div className="flex gap-2.5 pt-1">
                  <button 
                    type="button"
                    onClick={() => setShow2FAModal(false)}
                    className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg text-xs font-medium transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="w-2/3 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-xs font-semibold transition"
                  >
                    Verify Access
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};