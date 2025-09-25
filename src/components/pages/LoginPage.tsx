import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { useApp } from '../../App';
import LoadingSpinner from '../shared/LoadingSpinner';
import { ErrorMessage } from '../shared/SuccessMessage';
import API from '../../api/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (step === 'login') {
        if (!email || !password) {
          setError('Please enter both email and password');
          return;
        }
        // Step 1: request OTP
        await API.post('/student/login', { email, password });
        setStep('otp');
      } else {
        if (!otp) {
          setError('Please enter the OTP sent to your email');
          return;
        }
        // Step 2: verify OTP and receive JWT
        const { data } = await API.post('/student/verify-login', { email, otp });
        const token: string | undefined = data?.token;
        if (token) {
          localStorage.setItem('token', token);
        }

        const userPayload = {
          id: data?.user?.id || 'me',
          email: data?.user?.email || email,
          name: data?.user?.name || email.split('@')[0],
          role: data?.user?.role === 'counsellor' ? 'counsellor' : 'student',
          college: data?.user?.college || 'unknown',
          isNewUser: data?.user?.isNewUser ?? false,
        } as const;

        localStorage.setItem('user', JSON.stringify(userPayload));
        setUser(userPayload as any);

        if (userPayload.isNewUser) {
          navigate('/welcome');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Authentication failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mm-text-h1 text-foreground mb-2">Welcome back</h1>
          <p className="mm-text-body text-muted-foreground">
            Sign in to continue your wellness journey
          </p>
        </div>

        <Card className="mm-card mm-p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mm-input mt-2"
                placeholder="your.email@college.edu"
                required
                disabled={step === 'otp'}
              />
            </div>

            {step === 'login' && (
              <div>
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mm-input"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {step === 'otp' && (
              <div>
                <Label htmlFor="otp" className="text-foreground">Enter OTP</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mm-input mt-2"
                  placeholder="6-digit code"
                  maxLength={6}
                  autoFocus
                />
              </div>
            )}

            {error && (
              <ErrorMessage>
                {error}
              </ErrorMessage>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mm-btn-primary"
            >
              {isLoading ? (
                <div className="flex items-center mm-gap-2">
                  <LoadingSpinner size="sm" />
                  {step === 'login' ? 'Sending OTP...' : 'Verifying...'}
                </div>
              ) : (
                <>
                  {step === 'login' ? 'Send OTP' : 'Verify OTP'}
                  <Heart className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {step === 'otp' && (
              <div className="text-center mm-text-small text-muted-foreground">
                OTP has been sent to your email. Please enter it above to complete login.
              </div>
            )}

            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="mm-text-small text-primary hover:text-primary/80 underline transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 space-y-4">
          <p className="mm-text-small text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 underline transition-colors">
              Join ManMitra
            </Link>
          </p>
          
          <div>
            <Link to="/crisis">
              <Button 
                size="sm"
                className="crisis-support mm-btn-sm hover:scale-105 transition-transform"
              >
                Need Immediate Help?
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}