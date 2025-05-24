import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Building, Palette } from 'lucide-react';

const colorSchemes = [
  { name: 'Sky Blue', primary: '#3498db', secondary: '#2980b9', color: '#3498db' },
  { name: 'Green', primary: '#27ae60', secondary: '#229954', color: '#27ae60' },
  { name: 'Classic Black', primary: '#2c3e50', secondary: '#1b2631', color: '#2c3e50' },
  { name: 'Sunset Orange', primary: '#e67e22', secondary: '#d35400', color: '#e67e22' },
];

const Signup = ({ onLogin, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
    securityAnswer: '',
    colorScheme: colorSchemes[0]
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  //const handleColorSchemeSelect = (scheme) => {
    //setFormData({
      //...formData,
      //colorScheme: scheme
    //});
  //};

  const handleColorSchemeSelect = (scheme) => {
    setFormData({
      ...formData,
      colorScheme: scheme
    });
  
    // Apply immediately on selection
    document.documentElement.style.setProperty('--primary-color', scheme.primary);
    document.documentElement.style.setProperty('--secondary-color', scheme.secondary);
  
    // Save to localStorage for persistence if you like
    localStorage.setItem('activeColorScheme', JSON.stringify(scheme));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.businessName || !formData.securityAnswer) {
      setError('Please fill in all fields');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === formData.email)) {
      setError('Email already registered');
      return;
    }

    const newUser = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Apply color scheme to CSS variables
    //document.documentElement.style.setProperty('--primary-color', formData.colorScheme.primary);
    //document.documentElement.style.setProperty('--secondary-color', formData.colorScheme.secondary);
    //
    //
    //
    //localStorage.setItem('activeColorScheme', JSON.stringify(formData.colorScheme));
  
    //
    //
    //
    onLogin(newUser);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Create Your Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="Enter your business name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="securityAnswer">Security Question: What is your favorite color?</Label>
            <Input
              id="securityAnswer"
              name="securityAnswer"
              type="text"
              value={formData.securityAnswer}
              onChange={handleInputChange}
              placeholder="Enter your favorite color"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette size={16} />
              Choose Your Color Scheme
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.name}
                  type="button"
                  onClick={() => handleColorSchemeSelect(scheme)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.colorScheme.name === scheme.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: scheme.color }}
                    />
                    <span className="text-sm font-medium">{scheme.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button type="submit" className="w-full">
            Create Account
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Signup;