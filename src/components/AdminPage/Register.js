import './Register.css';
import axios from 'axios';
import Header from '../Header/Header';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [vendorId, setVendorId] = useState(''); // To select the vendor ID for registration
  const [availableVendors, setAvailableVendors] = useState([]);
  const [takenVendors, setTakenVendors] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Fetch vendor list on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // Fetch all vendors
        const vendorsResponse = await axios.get('http://localhost:5000/api/vendors');
        
        // Fetch vendor IDs that are already registered
        const takenVendorIdsResponse = await axios.get('http://localhost:5000/api/taken-vendor-ids');
        const takenVendorIds = takenVendorIdsResponse.data;

        // Filter vendors into available and taken based on vendor IDs
        const available = vendorsResponse.data.filter(vendor => !takenVendorIds.includes(vendor.id));
        const taken = vendorsResponse.data.filter(vendor => takenVendorIds.includes(vendor.id));

        setAvailableVendors(available);
        setTakenVendors(taken);
        
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setError('Failed to load vendor list. Please try again.');
      }
    };

    fetchVendors();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!vendorId) {
      setError('Please select a vendor to link this account.');
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
        }, 4000);
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
    <><Header />
    <div className="register-page">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Vendor Account Register</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <label>
          Username:
          <input
            type="text"
            className="register-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label>
          Select Vendor:
          <select
            value={vendorId}
            className="register-input"
            onChange={(e) => setVendorId(e.target.value)}
            required
          >
            <option value="">-- Select a Vendor --</option>
            {availableVendors.length > 0 && (
              <optgroup label="Available Vendors">
                {availableVendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name} (Available)
                  </option>
                ))}
              </optgroup>
            )}
            {takenVendors.length > 0 && (
              <optgroup label="Taken Vendors">
                {takenVendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id} disabled>
                    {vendor.name} (Taken)
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </label>
        <label>
          Password:
          <input
            type="password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            className="register-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="register-button">
          Register Vendor
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
    </>
  );
};

export default Register;
