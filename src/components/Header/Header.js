import React, { useState, useEffect, useRef } from 'react';
import GuestStatus from '../GuestStatus/GuestStatus';
import './Header.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import { addLocalNotification } from '../NotificationSystem/NotificationSystem'; // Import the notification function

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [guest, setGuest] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

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

  const navigateToShop = () => {
    // Use navigate to pass state when navigating to the shop
    navigate('/shop', { state: { fromHeader: true } });
  };

  return (
    <header className="header">
      <div className="header-logo-title">
        <a href="/haydencohort233/#/" className="logo-link">
          <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Chasing Nostalgia Logo" className="header-logo" />
        </a>
      </div>

      {/* {guest && <GuestStatus guest={guest} />} */}

      <nav className={`nav ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
        <ul>
          <li><a href="/haydencohort233/#/">Home</a></li>
          {/* Replace anchor tag with onClick event for shop */}
          <li onClick={navigateToShop}>Shop</li>
          <li><a href="/haydencohort233/#/events">Events</a></li>
          <li><a href="/haydencohort233/#/vendors">Vendors</a></li>
          <li><a href="/haydencohort233/#/blogs">Blogs</a></li>
          <li><a href="/haydencohort233/#/admin">Admin</a></li>
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
