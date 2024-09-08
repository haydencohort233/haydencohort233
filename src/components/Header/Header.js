import React, { useState, useEffect, useRef } from 'react';
import GuestStatus from '../GuestStatus/GuestStatus';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [guest, setGuest] = useState(null);
  const menuRef = useRef(null);

  // Toggle the menu open/close state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu if click outside of the menu
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  // Close menu on viewport resize back to desktop
  const handleResize = () => {
    if (window.innerWidth > 768) {
      setIsMenuOpen(false);
    }
  };

  // Fetch the latest guest vendor data
  useEffect(() => {
    const fetchLatestGuest = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/guests/latest');
        if (!response.ok) {
          throw new Error('Failed to fetch guest data');
        }
        const data = await response.json();
        setGuest(data);
      } catch (error) {
        console.error('Error fetching latest guest vendor:', error);
      }
    };

    fetchLatestGuest();
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-logo-title">
        <a href="/" className="logo-link">
          <img src="/images/logo.png" alt="Chasing Nostalgia Logo" className="header-logo" />
        </a>
      </div>
      {guest && <GuestStatus guest={guest} />} {/* Render GuestStatus only if data is available */}
      <nav className={`nav ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/blogs">Blogs</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/vendors">Vendors</a></li>
        </ul>
      </nav>
      <div className="menu-icon" onClick={toggleMenu}>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
        <span className="menu-bar"></span>
      </div>
    </header>
  );
};

export default Header;
