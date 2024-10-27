import './AdminPage.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import Tools from '../Tools/Tools';
import Status from '../Status/Status';
import Header from '../Header/Header';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddVendor from '../Add/AddVendor/AddVendor';

const AdminPage = () => {
  const navigate = useNavigate();
  const [isToolsOpen, setIsToolsOpen] = useState(true);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    const username = Cookies.get('adminUsername');
    const authToken = Cookies.get('authToken');
    const isAuthenticated = Cookies.get('adminAuthenticated');
  
    if (authToken && isAuthenticated && username) {
      try {
        // Send a POST request to log the vendor logout action with the correct username
        console.log('Attempting to logout user:', { username });
  
        await axios.post('http://localhost:5000/api/auth/logout', { username });
  
        // Clear cookies after successful logout
        Cookies.remove('authToken');
        Cookies.remove('adminUsername');
        Cookies.remove('adminAuthenticated');
  
        // Navigate to the login page
        navigate('/login');
      } catch (error) {
        // Log the error in console for debugging purposes
        console.error('Logout failed:', error);
      }
    } else {
      console.warn('No valid authentication token found for logout.');
      navigate('/login');
    }
  };  

  const toggleTools = () => {
    setIsToolsOpen(!isToolsOpen);
  };

  const openAddVendorModal = () => {
    setIsAddVendorOpen(true);
  };

  const closeAddVendorModal = () => {
    setIsAddVendorOpen(false);
  };

  return (
    <>
      <Header />
      <div className="admin-page">
        <div className="admin-actions">
          <button className="back-to-home-button" onClick={handleBackToHome}>
            <span className="arrow">&larr;</span> Back to Home
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="admin-content">
          <div className={`tools-sidebar ${isToolsOpen ? 'open' : 'closed'}`}>
            <Tools openAddVendor={openAddVendorModal} />
            <button className="tools-toggle-button" onClick={toggleTools}>
              {isToolsOpen ? '←' : '→'}
            </button>
          </div>
          <div className="metrics-status-container">
            <Status />
          </div>
        </div>
      </div>

      <AddVendor isOpen={isAddVendorOpen} onClose={closeAddVendorModal} />
    </>
  );
};

export default AdminPage;
