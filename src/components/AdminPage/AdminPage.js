import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Tools from '../Tools/Tools';
import './AdminPage.css';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Credentials
    const validUsername = 'admin';
    const validPassword = 'pass';

    if (username === validUsername && password === validPassword) {
      Cookies.set('adminAuthenticated', 'true', { expires: 1 }); // Cookie expires in 1 day
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

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('adminAuthenticated');
    setIsAuthenticated(false);
  };

  const handleBackToHome = () => {
    window.location.href = '/'; // Redirect to home page
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
        <Tools /> {/* Display the Tools component */}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminPage;
