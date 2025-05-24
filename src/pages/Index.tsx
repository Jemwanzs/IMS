
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            StockSales Pro
          </h1>
          <p className="text-lg text-gray-600">
            Stock & Sales Management Solution
          </p>
        </div>
        
        {showSignup ? (
          <Signup 
            onLogin={handleLogin}
            onSwitchToLogin={() => setShowSignup(false)}
          />
        ) : (
          <Login 
            onLogin={handleLogin}
            onSwitchToSignup={() => setShowSignup(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;