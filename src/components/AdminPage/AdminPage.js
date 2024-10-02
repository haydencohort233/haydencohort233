import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Tools from '../Tools/Tools';
import Status from '../Status/Status';
import Metrics from '../Metrics/Metrics';
import './AdminPage.css';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isToolsOpen, setIsToolsOpen] = useState(false); // State to manage Tools sidebar visibility

  const handleLogin = (e) => {
    e.preventDefault();

    // Credentials
    const validUsername = 'admin';
    const validPassword = 'pass';

    if (username === validUsername && password === validPassword) {
      Cookies.set('adminAuthenticated', 'true', { expires: 1 }); // Cookie expires in 1 day
      Cookies.set('adminUsername', username, { expires: 1 }); // Store the username in a cookie
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  // Check if user is authenticated
  React.useEffect(() => {
    const authCookie = Cookies.get('adminAuthenticated');
    if (authCookie) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleLogout = () => {
    Cookies.remove('adminAuthenticated');
    Cookies.remove('adminUsername');
    setIsAuthenticated(false);
  };

  const handleBackToHome = () => {
    window.location.href = '/'; // Homepage
  };

  const toggleTools = () => {
    setIsToolsOpen(!isToolsOpen);
  };

  if (isAuthenticated) {
    return (
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
          {/* Tools sidebar */}
          <div className={`tools-sidebar ${isToolsOpen ? 'open' : 'closed'}`}>
            <Tools />
            <button className="tools-toggle-button" onClick={toggleTools}>
              {isToolsOpen ? '←' : '→'}
            </button>
          </div>
          {/* Metrics and Status container */}
          <div className="metrics-status-container">
            <Status />
            <Metrics />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Admin Login</h2>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
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
