import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHospitalSymbol, FaHome, FaUserMd, FaUserInjured, FaClipboardList } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', name: 'Home', icon: <FaHome /> },
    { path: '/doctor', name: 'Doctor Entry', icon: <FaUserMd /> },
    { path: '/patient', name: 'Patient Assignment', icon: <FaUserInjured /> },
    { path: '/display', name: 'Doctor-Patient Display', icon: <FaClipboardList /> },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaHospitalSymbol className="brand-icon" />
          <span className="brand-text">HMS</span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-text">{link.name}</span>
              {location.pathname === link.path && <div className="active-indicator" />}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;