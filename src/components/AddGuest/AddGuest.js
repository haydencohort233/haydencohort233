import React, { useState } from 'react';
import './AddGuest.css';

const AddGuest = ({ isOpen, onClose }) => {
  const [guest, setGuest] = useState({
    name: '',
    guestavatar: null,
    guestphoto: null,
    description: '',
    schedule: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGuest({
      ...guest,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
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

    fetch('http://localhost:5000/api/guests', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Guest added:', data);
        onClose();
      })
      .catch((error) => {
        console.error('Error adding guest:', error);
        setError('An error occurred while adding the guest.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Guest Vendor</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={guest.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={guest.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Schedule:
            <input
              type="text"
              name="schedule"
              value={guest.schedule}
              onChange={handleChange}
              placeholder="e.g., Open 10am - 6pm"
              required
            />
          </label>
          <label>
            Guest Avatar:
            <input
              type="file"
              name="guestavatar"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
            />
            <p className="file-info">Size limit: 2MB. Accepted formats: .jpg, .jpeg, .png</p>
          </label>
          <label>
            Guest Photo (optional):
            <input
              type="file"
              name="guestphoto"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">Add Guest</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGuest;
