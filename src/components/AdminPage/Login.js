import './Login.css';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login attempt with username:', username);

    try {
        // Make a POST request to the backend login endpoint
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            username,
            password,
        });

        console.log('Backend response:', response);

        if (response.status === 200) {
            // Log vendor action
            if (response.data.vendorId) {
                await axios.post('http://localhost:5000/api/logs/log-vendor-action', {
                    vendorName: username,
                    action: 'logged in',
                    vendorId: response.data.vendorId, // Assuming vendorId is part of the response
                    logType: 'vendor'
                });
            }

            // Set cookies for authenticated session
            Cookies.set('adminAuthenticated', 'true', { expires: 1, secure: true, sameSite: 'strict' }); // 1 Day
            Cookies.set('authToken', response.data.token, { expires: 1, secure: true, sameSite: 'strict' }); // Store the JWT token
            Cookies.set('adminUsername', username, { expires: 1, secure: true, sameSite: 'strict' }); // Store the username

            console.log('Login successful. Navigating to admin page.');
            setError('');
            navigate('/admin');
        } else {
            console.error('Unexpected response status:', response.status);
            setError('An unexpected error occurred. Please try again.');
        }
    } catch (error) {
        if (error.response) {
            console.error('Login error:', error.response.data);
            setError(error.response.data.error || 'Invalid username or password');
        } else {
            console.error('Network or server error:', error);
            setError('An error occurred during login. Please try again.');
        }
    }
};

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Employees Login</h2>
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
          <button type="submit" className="login-button">Login</button>
          <button type="button" className="back-to-home-button" onClick={() => navigate('/')}>
            <span className="arrow">&larr;</span> Back to Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
