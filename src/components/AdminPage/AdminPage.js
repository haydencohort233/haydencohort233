import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Tools from '../Tools/Tools';
import Status from '../Status/Status';
import Metrics from '../Metrics/Metrics';
import Header from '../Header/Header';
import AddVendor from '../Add/AddVendor/AddVendor';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isToolsOpen, setIsToolsOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    /* Credentials */
    const validUsername = process.env.REACT_APP_ADMIN_USERNAME;
    const validPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    if (username === validUsername && password === validPassword) {
      Cookies.set('adminAuthenticated', 'true', { expires: 1 }); // 1 Day
      Cookies.set('adminUsername', username, { expires: 1 }); // 1 Day
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  // Check if user is authenticated
  React.useEffect(() => {
    const authCookie = Cookies.get('adminAuthenticated');
    if (authCookie === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleLogout = () => {
    console.log('Logout button clicked');
    Cookies.remove('adminAuthenticated');
    Cookies.remove('adminUsername');
    setIsAuthenticated(false);
    window.location.reload(); // Force re-render after logout
  };

  const handleBackToHome = () => {
    navigate('/');
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

  if (isAuthenticated) {
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
  }

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Admin Login</h2>
        <label>
          Username:
          <input
          className="admin-page-user-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            className="admin-page-pass-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <div className="login-actions">
          <button type="button" className="back-to-home-button" onClick={handleBackToHome}>
            <span className="arrow">&larr;</span> Back to Home
          </button>
          <button type="submit" className="login-button">Login</button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;
