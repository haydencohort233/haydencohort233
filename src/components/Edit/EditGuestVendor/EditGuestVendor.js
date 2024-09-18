import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './EditGuestVendor.css';

const EditGuestVendor = ({ isOpen, onClose }) => {
  const [guests, setGuests] = useState([]);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [guestData, setGuestData] = useState({
    name: '',
    description: '',
    schedule: '',
    guestavatar: '',
    guestphoto: '',
    break: false,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [guestPhotoPreview, setGuestPhotoPreview] = useState(null);
  const [error, setError] = useState('');

  // Reset state when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedGuestId(null);
      setGuestData({
        name: '',
        description: '',
        schedule: '',
        guestavatar: '',
        guestphoto: '',
        break: false,
      });
      setAvatarPreview(null);
      setGuestPhotoPreview(null);
      setError('');
    }
  }, [isOpen]);

  // Fetch all guest vendors when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:5000/api/guests')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setGuests(data.sort((a, b) => a.name.localeCompare(b.name))); // Sort guests A-Z
        })
        .catch((err) => {
          console.error('Error fetching guests:', err.message);
          setError('Failed to load guests. Please try again.');
        });
    }
  }, [isOpen]);

  // Fetch selected guest data when a guest is selected
  useEffect(() => {
    if (selectedGuestId) {
      fetch(`http://localhost:5000/api/guests/${selectedGuestId}`)
        .then((response) => response.json())
        .then((data) => {
          setGuestData(data);
          setAvatarPreview(data.guestavatar);
          setGuestPhotoPreview(data.guestphoto);
        })
        .catch((err) => {
          console.error('Error fetching guest data:', err);
        });
    }
  }, [selectedGuestId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestData({ ...guestData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'guestavatar') {
        setAvatarPreview(URL.createObjectURL(files[0])); // Set avatar preview
      } else if (name === 'guestphoto') {
        setGuestPhotoPreview(URL.createObjectURL(files[0])); // Set photo preview
      }
      setGuestData({ ...guestData, [name]: files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', guestData.name);
    formData.append('description', guestData.description);
    formData.append('schedule', guestData.schedule);
    if (guestData.guestavatar) formData.append('guestavatar', guestData.guestavatar);
    if (guestData.guestphoto) formData.append('guestphoto', guestData.guestphoto);
  
    const adminUsername = Cookies.get('adminUsername'); // Get admin username from cookies
  
    try {
      const response = await fetch(`http://localhost:5000/api/guests/${selectedGuestId}`, {
        method: 'PATCH',
        body: formData,
        headers: {
          'X-Admin-Username': adminUsername, // Pass the username in the request header
        },
      });
  
      if (response.ok) {
        console.log(`Guest updated successfully: ${guestData.name}`); // Log success message
        onClose(); // Close modal
      } else {
        const errorData = await response.json();
        console.error('Error updating guest:', errorData);
        setError('Failed to update guest. Please try again.');
      }
    } catch (err) {
      console.error('Error updating guest:', err);
      setError('Failed to update guest. Please try again.');
    }
  };  

  const handleDelete = async (id) => {
    const confirmation = prompt('Are you sure to delete this guest? Type "DELETE" to confirm.');
    if (confirmation === 'DELETE') {
      const adminUsername = Cookies.get('adminUsername'); // Get the admin username from the cookie

      try {
        const response = await fetch(`http://localhost:5000/api/guests/${id}`, {
          method: 'DELETE',
          headers: {
            'X-Admin-Username': adminUsername, // Pass the username in the request header
          },
        });

        if (response.ok) {
          console.log(`Guest deleted successfully: ${guestData.name} (ID: ${id})`); // Log success message
          setGuests(guests.filter(guest => guest.id !== id));
          if (selectedGuestId === id) {
            setSelectedGuestId(null);
            setGuestData({ name: '', description: '', schedule: '', guestavatar: '', guestphoto: '' });
          }
        } else {
          console.error('Failed to delete guest');
        }
      } catch (err) {
        console.error('Error deleting guest:', err);
      }
    }
  };

  const handleToggleBreak = async () => {
    const confirmBreak = window.confirm(`Are you sure you want ${guestData.name} to go on break?`);
    if (!confirmBreak) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/guests/${selectedGuestId}/toggle-break`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ break: !guestData.break }),
      });
  
      if (response.ok) {
        setGuestData({ ...guestData, break: !guestData.break }); // Toggle the break status
      } else {
        const errorData = await response.json();
        console.error('Error toggling break status:', errorData);
        setError('Failed to update break status. Please try again.');
      }
    } catch (err) {
      console.error('Error toggling break status:', err);
      setError('Failed to update break status. Please try again.');
    }
  };  

  if (!isOpen) return null;

  return (
    <div className="edit-guest-modal-overlay">
      <div className="edit-guest-modal-content">
        <h2 className="edit-guest-title">
          Edit Guests
          <span className="edit-guest-close-button" onClick={onClose}>×</span>
        </h2>
        {error && <p className="edit-guest-error-message">{error}</p>}

        {!selectedGuestId ? (
          <div className="edit-guest-list">
            <h3>Select a Guest</h3>
            <ul>
              {guests.map((guest) => (
                <li key={guest.id} onClick={() => setSelectedGuestId(guest.id)}>
                  {guest.name}
                </li>
              ))}
            </ul>
            <button type="button" className="edit-guest-cancel-button-wide" onClick={onClose}>
              Cancel
            </button>
          </div>
        ) : (
          <form className="edit-guest-form" onSubmit={handleSubmit}>
            <label className="edit-guest-label">
              Name:
              <input
                type="text"
                name="name"
                className="edit-guest-input"
                value={guestData.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="edit-guest-label">
              Description:
              <textarea
                name="description"
                className="edit-guest-textarea"
                value={guestData.description}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="edit-guest-label">
              Schedule:
              <input
                type="text"
                name="schedule"
                className="edit-guest-input"
                value={guestData.schedule}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="edit-guest-label">
              Avatar:
              <input
                type="file"
                name="guestavatar"
                className="edit-guest-input"
                accept="image/*"
                onChange={handleFileChange}
              />
              {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="edit-guest-image-preview" />}
            </label>
            <label className="edit-guest-label">
              Guest Photo:
              <input
                type="file"
                name="guestphoto"
                className="edit-guest-input"
                accept="image/*"
                onChange={handleFileChange}
              />
              {guestPhotoPreview && <img src={guestPhotoPreview} alt="Guest Photo Preview" className="edit-guest-image-preview" />}
            </label>
            <div className="edit-guest-buttons">
              <div className="edit-guest-buttons-left">
                <button type="button" className="edit-guest-back-button" onClick={() => setSelectedGuestId(null)}>← Back</button>
                <button type="button" className="edit-guest-cancel-button" onClick={onClose}>Cancel</button>
              </div>
              <button type="submit" className="edit-guest-save-button">Update Guest</button>
              <button type="button" className="edit-guest-break-button" onClick={handleToggleBreak}>
                {guestData.break ? 'Off Break' : 'On Break'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditGuestVendor;
