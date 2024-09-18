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
          console.log('Fetched events:', data); // Log the event data
          if (Array.isArray(data)) {
            setEvents(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
          } else {
            throw new Error('Unexpected response format');
          }
        })
        .catch(err => {
          console.error('Error fetching events:', err.message);
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
            setEventData(data);
          } else {
            throw new Error('Event data not found');
          }
        })
        .catch(err => {
          console.error('Error fetching event data:', err);
          setError('Failed to load event data. Please try again.');
        });
    }
  }, [selectedEventId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

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
        console.error('Error updating event:', errorData);
        setError('Failed to update event. Please try again.');
      }
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event. Please try again.');
    }
  };  

  // Reset the component state when closing
  const handleClose = () => {
    setSelectedEventId(null);
    setEventData({ name: '', description: '', date: '' }); // Reset event data
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
