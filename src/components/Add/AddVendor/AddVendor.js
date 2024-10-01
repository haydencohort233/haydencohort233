import React, { useState, useEffect, forwardRef } from 'react';
import Cookies from 'js-cookie';
import './AddVendor.css';
import locations from './locations.json'; // Import the list of locations
import categories from './categories.json'; // Import the list of categories

const AddVendor = forwardRef(({ isOpen, onClose }, ref) => {
  const [vendor, setVendor] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    avatar: null,
    vendorphoto: null,
  });
  const [error, setError] = useState(null);
  const [takenLocations, setTakenLocations] = useState([]);

  // Fetch the taken locations from the backend (assuming you have an API for this)
  useEffect(() => {
    fetch('http://localhost:5000/api/taken-locations')
      .then(response => response.json())
      .then(data => {
        setTakenLocations(data); // Assume the API returns an array of taken locations
      })
      .catch(error => {
        console.error('Error fetching taken locations:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a .jpg or .png file.');
        return;
      }
      setVendor({ ...vendor, [name]: file });
      setError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', vendor.name);
    formData.append('description', vendor.description);
    formData.append('location', vendor.location);
    formData.append('category', vendor.category);

    if (vendor.avatar) {
      formData.append('avatar', vendor.avatar);
    }

    if (vendor.vendorphoto) {
      formData.append('vendorphoto', vendor.vendorphoto);
    }

    // Get the admin username from cookies
    const adminUsername = Cookies.get('adminUsername');

    fetch('http://localhost:5000/api/vendors', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Admin-Username': adminUsername,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add vendor');
        }
        return response.json();
      })
      .then((data) => {
        console.log(`Vendor added: ${vendor.name} (ID: ${data.id})`);
        onClose();
      })
      .catch((error) => {
        console.error('Error adding vendor:', error);
        setError('An error occurred while adding the vendor.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="add-vendor-modal-overlay" ref={ref}>
      <div className="add-vendor-modal-content">
        <button className="add-vendor-close-button" onClick={onClose}>
          ×
        </button>
        <h2 className="add-vendor-title">Add New Vendor</h2>
        <form onSubmit={handleSubmit} className="add-vendor-form">
          <label className="add-vendor-label">
            Name:
            <input
              type="text"
              name="name"
              className="add-vendor-input"
              value={vendor.name}
              onChange={handleChange}
              required
              placeholder="Vendor Name"
            />
          </label>
          <label className="add-vendor-label">
            Description:
            <textarea
              name="description"
              className="add-vendor-textarea"
              value={vendor.description}
              onChange={handleChange}
              required
              placeholder="Vendor Description"
            />
          </label>
          <label className="add-vendor-label">
            Location:
            <select
              name="location"
              className="add-vendor-dropdown"
              value={vendor.location}
              onChange={handleChange}
              required
            >
              <option value="">Vendor Location</option>
              {locations.map((location) => (
                <option 
                  key={location} 
                  value={location} 
                  disabled={takenLocations.includes(location)}
                >
                  {location} {takenLocations.includes(location) && '(Taken)'}
                </option>
              ))}
            </select>
          </label>
          <label className="add-vendor-label">
            Category:
            <select
              name="category"
              className="add-vendor-dropdown"
              value={vendor.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="add-vendor-label">
            Avatar:
            <input
              type="file"
              name="avatar"
              className="add-vendor-input"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <p className="add-vendor-file-info">Size limit: 2MB. Accepted formats: .jpg, .jpeg, .png</p>
          </label>
          <label className="add-vendor-label">
            Vendor Photo:
            <input
              type="file"
              name="vendorphoto"
              className="add-vendor-input"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <p className="add-vendor-file-info">Size limit: 2MB. Accepted formats: .jpg, .jpeg, .png</p>
          </label>
          {error && <p className="add-vendor-error">{error}</p>}
          <div className="add-vendor-buttons">
            <button type="button" className="add-vendor-cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-vendor-save-button">
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default AddVendor;
