import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './EditEvents.css';

const EditEvents = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: '',
    preview_text: '',  // Added preview_text
    title_photo: '',   // Added title_photo
    photo_url: '',     // Added photo_url for banner images
  });
  const [error, setError] = useState('');

  // Format the date for the date input field
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0]; // Format as yyyy-mm-dd
  };

  // Fetch all events when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:5000/api/events')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setEvents(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
          } else {
            throw new Error('Unexpected response format');
          }
        })
        .catch(err => {
          setError('Failed to load events. Please try again.');
        });
    }
  }, [isOpen]);

  // Fetch selected event data when an event is selected
  useEffect(() => {
    if (selectedEventId) {
      fetch(`http://localhost:5000/api/events/${selectedEventId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data) {
            setEventData({
              name: data.name,
              description: data.description,
              date: data.date,
              preview_text: data.preview_text,  // Load preview_text
              title_photo: data.title_photo,    // Load title_photo
              photo_url: data.photo_url         // Load photo_url for banner images
            });
          } else {
            throw new Error('Event data not found');
          }
        })
        .catch(err => {
          setError('Failed to load event data. Please try again.');
        });
    }
  }, [selectedEventId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  // Handle form submission to update the event
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventId) return;
  
    const adminUsername = Cookies.get('adminUsername'); // Get the admin username from cookies
  
    try {
      const response = await fetch(`http://localhost:5000/api/events/${selectedEventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Username': adminUsername, // Pass the admin username in headers
        },
        body: JSON.stringify(eventData),
      });
  
      if (response.ok) {
        handleClose(); // Close modal after successful update
      } else {
        const errorData = await response.json();
        setError('Failed to update event. Please try again.');
      }
    } catch (err) {
      setError('Failed to update event. Please try again.');
    }
  };

  // Reset the component state when closing
  const handleClose = () => {
    setSelectedEventId(null);
    setEventData({ name: '', description: '', date: '', preview_text: '', title_photo: '', photo_url: '' }); // Reset event data
    setError(''); // Clear any existing errors
    onClose(); // Call parent onClose
  };

  if (!isOpen) return null;

  return (
    <div className="edit-event-modal-overlay">
      <div className="edit-event-modal-content">
        <h2 className="edit-event-title">
          Edit Events
          <span className="edit-event-close-modal" onClick={handleClose}>×</span>
        </h2>
        {error && <p className="edit-event-error-message">{error}</p>}

        {!selectedEventId ? (
          <div className="edit-event-list">
            <h3>Select an Event</h3>
            <ul>
              {events.map(event => (
                <li key={event.id} onClick={() => setSelectedEventId(event.id)}>
                  {event.name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <form className="edit-event-form" onSubmit={handleSubmit}>
            <label className="edit-event-label">
              Name:
              <input
                type="text"
                name="name"
                className="edit-event-input"
                value={eventData.name || ''}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="edit-event-label">
              Description:
              <textarea
                name="description"
                className="edit-event-textarea"
                value={eventData.description || ''}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="edit-event-label">
              Date:
              <input
                type="date"
                name="date"
                className="edit-event-input"
                value={formatDateForInput(eventData.date)}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="edit-event-label">
              Preview Text:
              <textarea
                name="preview_text"
                className="edit-event-textarea"
                value={eventData.preview_text || ''}
                onChange={handleInputChange}
              />
            </label>
            <label className="edit-event-label">
              Title Photo URL:
              <input
                type="text"
                name="title_photo"
                className="edit-event-input"
                value={eventData.title_photo || ''}
                onChange={handleInputChange}
              />
            </label>
            <label className="edit-event-label">
              Photo URL:
              <input
                type="text"
                name="photo_url"
                className="edit-event-input"
                value={eventData.photo_url || ''}
                onChange={handleInputChange}
              />
            </label>
            <div className="edit-event-buttons">
              <div className="edit-event-buttons-left">
                <button type="button" className="edit-event-back-button" onClick={() => setSelectedEventId(null)}>
                  ← Back
                </button>
                <button type="button" className="edit-event-cancel-button" onClick={handleClose}>Cancel</button>
              </div>
              <button type="submit" className="edit-event-save-button">Update Event</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditEvents;
