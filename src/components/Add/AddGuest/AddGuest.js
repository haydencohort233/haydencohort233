import React, { useState, forwardRef } from 'react';
import Cookies from 'js-cookie';
import './AddGuest.css';

const AddGuest = forwardRef(({ isOpen, onClose }, ref) => {
  const [guest, setGuest] = useState({
    name: '',
    guestavatar: null,
    guestphoto: null,
    description: '',
    schedule: '',
  });
  const [error, setError] = useState(null);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuest({ ...guest, [name]: value });
  };

  // Handle file inputs for avatar and guest photo
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a .jpg or .png file.');
        return;
      }
      setGuest({ ...guest, [name]: file });
      setError(null); // Clear any previous error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', guest.name);
    formData.append('description', guest.description);
    formData.append('schedule', guest.schedule);
    if (guest.guestavatar) {
      formData.append('guestavatar', guest.guestavatar);
    }
    if (guest.guestphoto) {
      formData.append('guestphoto', guest.guestphoto);
    }

    // Get the admin username from the cookies
    const adminUsername = Cookies.get('adminUsername');

    fetch('http://localhost:5000/api/guests', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Admin-Username': adminUsername, // Pass admin username in the request headers
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add guest');
        }
        return response.json();
      })
      .then((data) => {
        // Console log that matches the format in AddVendor
        console.log(`Guest added: ${guest.name} (ID: ${data.id})`);
        onClose(); // Close modal after adding guest
      })
      .catch((error) => {
        console.error('Error adding guest:', error);
        setError('An error occurred while adding the guest.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="add-guest-modal-overlay" ref={ref}>
      <div className="add-guest-modal-content">
        <button className="add-guest-close-button" onClick={onClose}>
          ×
        </button>
        <h2 className="add-guest-title">Add New Guest</h2>
        <form onSubmit={handleSubmit} className="add-guest-form">
          <label className="add-guest-label">
            Name:
            <input
              type="text"
              name="name"
              className="add-guest-input"
              value={guest.name}
              onChange={handleChange}
              required
              placeholder="Guest Name"
            />
          </label>
          <label className="add-guest-label">
            Description:
            <textarea
              name="description"
              className="add-guest-textarea"
              value={guest.description}
              onChange={handleChange}
              required
              placeholder="Guest Description (e.g., Tattoo Artist)"
            />
          </label>
          <label className="add-guest-label">
            Schedule:
            <input
              type="text"
              name="schedule"
              className="add-guest-input"
              value={guest.schedule}
              onChange={handleChange}
              placeholder="e.g., 10am - 6pm"
              required
            />
          </label>
          <label className="add-guest-label">
            Guest Avatar:
            <input
              type="file"
              name="guestavatar"
              className="add-guest-input"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
            />
            <p className="add-guest-file-info">Size limit: 2MB. Accepted formats: .jpg, .jpeg, .png</p>
          </label>
          <label className="add-guest-label">
            Guest Photo (optional):
            <input
              type="file"
              name="guestphoto"
              className="add-guest-input"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </label>
          {error && <p className="add-guest-error">{error}</p>}
          <div className="add-guest-buttons">
            <button type="submit" className="add-guest-save-button">Add Guest</button>
            <button type="button" className="add-guest-cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default AddGuest;
