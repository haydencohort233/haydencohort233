import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './EditVendor.css';

const EditVendor = ({ isOpen, onClose }) => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [vendorData, setVendorData] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    avatar: '',
    vendorphoto: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [vendorPhotoPreview, setVendorPhotoPreview] = useState(null);
  const [error, setError] = useState('');

  const resetState = () => {
    setSelectedVendorId(null);
    setVendorData({ name: '', description: '', location: '', category: '', avatar: '', vendorphoto: '' });
    setAvatarPreview(null);
    setVendorPhotoPreview(null);
    setError('');
  };

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:5000/api/vendors')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setVendors(data.sort((a, b) => a.name.localeCompare(b.name)));
        })
        .catch(err => {
          console.error('Error fetching vendors:', err.message);
          setError('Failed to load vendors. Please try again.');
        });
    } else {
      resetState();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (selectedVendorId) {
      fetch(`http://localhost:5000/api/vendors/${selectedVendorId}`)
        .then(response => response.json())
        .then(data => {
          setVendorData(data);
          setAvatarPreview(data.avatar);
          setVendorPhotoPreview(data.vendorphoto);
        })
        .catch(err => {
          console.error('Error fetching vendor data:', err);
        });
    }
  }, [selectedVendorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'avatar') {
        setAvatarPreview(URL.createObjectURL(files[0]));
      } else if (name === 'vendorphoto') {
        setVendorPhotoPreview(URL.createObjectURL(files[0]));
      }
      setVendorData({ ...vendorData, [name]: files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', vendorData.name);
    formData.append('description', vendorData.description);
    formData.append('location', vendorData.location);
    formData.append('category', vendorData.category);
    if (vendorData.avatar) formData.append('avatar', vendorData.avatar);
    if (vendorData.vendorphoto) formData.append('vendorphoto', vendorData.vendorphoto);
  
    const adminUsername = Cookies.get('adminUsername'); // Get admin username from cookies
  
    try {
      const response = await fetch(`http://localhost:5000/api/vendors/${selectedVendorId}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'X-Admin-Username': adminUsername,
        },
      });
  
      if (response.ok) {
        console.log(`Vendor updated successfully: ${vendorData.name}`);
        onClose(); // Close modal
      } else {
        const errorData = await response.json();
        console.error('Error updating vendor:', errorData);
        setError('Failed to update vendor. Please try again.');
      }
    } catch (err) {
      console.error('Error updating vendor:', err);
      setError('Failed to update vendor. Please try again.');
    }
  };
  
  const handleDelete = async (id) => {
    const confirmation = prompt('Are you sure to delete this vendor? Type "DELETE" to confirm.');
    if (confirmation === 'DELETE') {
      const adminUsername = Cookies.get('adminUsername');
  
      try {
        const response = await fetch(`http://localhost:5000/api/vendors/${id}`, {
          method: 'DELETE',
          headers: {
            'X-Admin-Username': adminUsername,
          },
        });
        if (response.ok) {
          console.log(`Vendor deleted successfully: ${id}`);
          setVendors(vendors.filter(vendor => vendor.id !== id));
          if (selectedVendorId === id) resetState();
        } else {
          console.error('Failed to delete vendor');
        }
      } catch (err) {
        console.error('Error deleting vendor:', err);
      }
    }
  };  

  if (!isOpen) return null;

  return (
    <div className="edit-vendor-modal-overlay">
      <div className="edit-vendor-modal-content">
        <h2 className="edit-vendor-title">
          Edit Vendors
          <span className="edit-vendor-close-button" onClick={onClose}>×</span>
        </h2>
        {error && <p className="edit-vendor-error-message">{error}</p>}
        {!selectedVendorId ? (
          <div className="edit-vendor-list">
            <h3>Select a Vendor</h3>
            <ul>
              {vendors.map(vendor => (
                <li key={vendor.id}>
                  <span onClick={() => setSelectedVendorId(vendor.id)}>
                    {vendor.name}
                  </span>
                  <span
                    className="delete-vendor-button"
                    onClick={() => handleDelete(vendor.id)}
                  >
                    ✖
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <form className="edit-vendor-form" onSubmit={handleSubmit}>
            <label className="edit-vendor-label">Name:
              <input type="text" name="name" className="edit-vendor-input" value={vendorData.name} onChange={handleInputChange} required />
            </label>
            <label className="edit-vendor-label">Description:
              <textarea name="description" className="edit-vendor-textarea" value={vendorData.description} onChange={handleInputChange} required />
            </label>
            <label className="edit-vendor-label">Location:
              <input type="text" name="location" className="edit-vendor-input" value={vendorData.location} onChange={handleInputChange} required />
            </label>
            <label className="edit-vendor-label">Category:
              <input type="text" name="category" className="edit-vendor-input" value={vendorData.category} onChange={handleInputChange} required />
            </label>
            <label className="edit-vendor-label">Avatar:
              <input type="file" name="avatar" className="edit-vendor-input" accept="image/*" onChange={handleFileChange} />
              {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="edit-vendor-image-preview" />}
            </label>
            <label className="edit-vendor-label">Vendor Photo:
              <input type="file" name="vendorphoto" className="edit-vendor-input" accept="image/*" onChange={handleFileChange} />
              {vendorPhotoPreview && <img src={vendorPhotoPreview} alt="Vendor Photo Preview" className="edit-vendor-image-preview" />}
            </label>
            <div className="edit-vendor-buttons">
              <div className="edit-vendor-buttons-left">
                <button type="button" className="edit-vendor-back-button" onClick={() => setSelectedVendorId(null)}>← Back</button>
              </div>
              <button type="submit" className="edit-vendor-save-button">Update Vendor</button>
            </div>
          </form>
        )}
        <div className="edit-vendor-footer">
          <button type="button" className="edit-vendor-list-cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVendor;
