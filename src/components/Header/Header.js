import React, { useState, useEffect, useRef } from 'react';
import GuestStatus from '../GuestStatus/GuestStatus';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [guest, setGuest] = useState(null);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

  // Fetch all guest vendors and filter out guests that are on break
  useEffect(() => {
    const fetchLatestGuest = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/guests');
        if (!response.ok) {
          throw new Error('Failed to fetch guest data');
        }
        const data = await response.json();

        const availableGuests = data.filter((guest) => !guest.break);

        const latestGuest = availableGuests.length > 0 ? availableGuests[availableGuests.length - 1] : null;
        setGuest(latestGuest);
      } catch (error) {
        console.error('Error fetching guest vendors:', error);
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
        <a href="/haydencohort233/#/" className="logo-link">
          <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Chasing Nostalgia Logo" className="header-logo" />
        </a>
      </div>

      {guest && <GuestStatus guest={guest} />}

      <nav className={`nav ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
        <ul>
          <li><a href="/haydencohort233/#/">Home</a></li>
          <li><a href="/haydencohort233/#/blogs">Blogs</a></li>
          <li><a href="/haydencohort233/#/events">Events</a></li>
          <li><a href="/haydencohort233/#/vendors">Vendors</a></li>
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
