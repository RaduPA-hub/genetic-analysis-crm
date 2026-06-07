import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import Dashboard from './components/Dashboard';
import PatientRegistrationPage from './components/PatientRegistrationPage';
import FamilyPage from './components/FamilyPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [userRole, setUserRole] = useState('user'); // 'user' or 'admin'
  const [showSignup, setShowSignup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (payload) => {
    setIsLoggedIn(true);
    setUserRole(payload.role === 'admin' ? 'admin' : 'user');
    setCurrentUser(payload);
    setCurrentPage('home');
    setShowSignup(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('user');
    setCurrentPage('home');
    setShowSignup(false);
    setCurrentUser(null);
  };

  const handleSwitchToSignup = () => {
    setShowSignup(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
  };

  const renderPage = () => {
    if (!isLoggedIn) {
      if (showSignup) {
        return <SignupPage onSignup={handleLogin} onSwitchToLogin={handleSwitchToLogin} />;
      }
      return <LoginPage onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'families':
        return userRole === 'user' ? <FamilyPage currentUser={currentUser} /> : <HomePage />;
      case 'profile':
        return <ProfilePage onLogout={handleLogout} />;
      case 'dashboard':
        return userRole === 'admin' ? <Dashboard onLogout={handleLogout} /> : <HomePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          userRole={userRole}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/patient-registration" element={
            isLoggedIn ? <PatientRegistrationPage /> : <Navigate to="/" replace />
          } />
          <Route path="/" element={renderPage()} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 