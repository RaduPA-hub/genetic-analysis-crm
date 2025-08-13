import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ isLoggedIn, userRole, currentPage, onPageChange, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePageChange = (page) => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => handlePageChange('home')}>
          <i className="fas fa-calendar-check"></i>
          <span>Exome Scheduler</span>
        </div>
        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handlePageChange('home'); }}
            >
              Home
            </a>
          </li>
          {userRole === 'admin' && (
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handlePageChange('dashboard'); }}
              >
                Dashboard
              </a>
            </li>
          )}
          <li className="nav-item">
            <a href="#" className="nav-link">About</a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">Contact</a>
          </li>
          {isLoggedIn && (
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handlePageChange('profile'); }}
              >
                <i className="fas fa-user"></i>
                Profile
              </a>
            </li>
          )}
          {isLoggedIn && (
            <li className="nav-item">
              <button className="nav-link" onClick={onLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Sign Out
              </button>
            </li>
          )}
        </ul>
        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 