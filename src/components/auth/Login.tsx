import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);

    if (user && user.securityAnswer.toLowerCase() === securityAnswer.toLowerCase()) {
      alert(`Your password is: ${user.password}`);
      setShowForgotPassword(false);
      setSecurityAnswer('');
    } else {
      setError('Invalid email or security answer');
    }
  };

  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">
          {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email</Label>
              <Input
                id="resetEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityAnswer">What is your favorite color?</Label>
              <Input
                id="securityAnswer"
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter your security answer"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="space-y-2">
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
    
  );
  
};


export default Login;