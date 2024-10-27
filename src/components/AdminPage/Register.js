import './Register.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [vendorId, setVendorId] = useState(''); // Optional: Assign vendor ID based on requirements
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        vendorId,
      });
  
      if (response.status === 201) {
        setSuccessMessage('Vendor registered successfully!');
        setError('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setVendorId('');

        setTimeout(() => {
          navigate('/login');
        }, 4000); // 4 Seconds to show Success Message(s) then move on to next page
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    }
  };  

  return (
    <div className="register-page">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Register Vendor</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

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
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="register-button">
          Register Vendor
        </button>
      </form>
    </div>
  );
};

export default Register;
