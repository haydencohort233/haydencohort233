import React, { useState } from 'react';
import './AddVendor.css';

const AddVendor = ({ isOpen, onClose }) => {
  const [vendor, setVendor] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    avatar: null
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor({ ...vendor, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a .jpg or .png file.');
        return;
      }

      setVendor({ ...vendor, avatar: file });
      setError(null); // Clear any previous error
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

    fetch('http://localhost:5000/api/vendors', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Vendor added:', data);
        onClose();
      })
      .catch(error => {
        console.error('Error adding vendor:', error);
        setError('An error occurred while adding the vendor.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Vendor</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={vendor.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={vendor.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={vendor.location}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              name="category"
              value={vendor.category}
              onChange={handleChange}
            />
          </label>
          <label>
            Avatar:
            <input
              type="file"
              name="avatar"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <p className="file-info">Size limit: 2MB. Accepted formats: .jpg, .jpeg, .png</p>
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">Add Vendor</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
