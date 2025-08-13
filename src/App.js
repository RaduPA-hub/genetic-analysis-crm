import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [userRole, setUserRole] = useState('user'); // 'user' or 'admin'

  const handleLogin = (credentials) => {
    // This will be implemented later with actual authentication logic
    console.log('Login attempt:', credentials);
    setIsLoggedIn(true);
    
    // For demo purposes, set admin role for specific email
    if (credentials.email === 'admin@service.com') {
      setUserRole('admin');
    } else {
      setUserRole('user');
    }
    
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (!isLoggedIn) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'profile':
        return <ProfilePage onLogout={handleLogout} />;
      case 'dashboard':
        return userRole === 'admin' ? <Dashboard onLogout={handleLogout} /> : <HomePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        userRole={userRole}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      {renderPage()}
    </div>
  );
}

export default App; 