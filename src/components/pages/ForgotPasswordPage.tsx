import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ArrowLeft, Heart, Mail } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import { SuccessMessage } from '../shared/SuccessMessage';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSuccess(true);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mm-text-h1 text-foreground mb-2">Reset your password</h1>
          <p className="mm-text-body text-muted-foreground">
            We'll send you a link to reset your password
          </p>
        </div>

        <Card className="mm-card mm-p-4">
          {isSuccess ? (
            <div className="text-center space-y-6">
              <SuccessMessage>
                Reset link sent! Check your email inbox.
              </SuccessMessage>
              <p className="mm-text-small text-muted-foreground">
                We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>
              </p>
              <div className="space-y-3">
                <Link to="/login">
                  <Button className="w-full mm-btn-primary">
                    Back to Sign In
                  </Button>
                </Link>
                <button 
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                  className="w-full mm-text-small text-primary hover:text-primary/80 underline"
                >
                  Try a different email
                </button>
              </div>
            </div>
          ) : (
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
                />
                <p className="mm-text-xs text-muted-foreground mt-1">
                  Enter the email address associated with your account
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full mm-btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center mm-gap-2">
                    <LoadingSpinner size="sm" />
                    Sending reset link...
                  </div>
                ) : (
                  <>
                    Send Reset Link
                    <Mail className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center mm-gap-2 mm-text-small text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}