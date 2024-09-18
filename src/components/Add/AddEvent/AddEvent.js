import React, { useState, forwardRef } from 'react';
import Cookies from 'js-cookie';
import './AddEvent.css';

const AddEvent = forwardRef(({ isOpen, onClose }, ref) => {
  const [event, setEvent] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    photo: null,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a .jpg or .png file.');
        return;
      }
      setEvent({ ...event, photo: file });
      setError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', event.title);
    formData.append('date', event.date);
    formData.append('time', event.time);
    formData.append('description', event.description);
    if (event.photo) {
      formData.append('photo', event.photo);
    }
  
    const adminUsername = Cookies.get('adminUsername'); // Get the admin username from cookies
  
    fetch('http://localhost:5000/api/events', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Admin-Username': adminUsername, // Pass admin username in the request headers
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Event added: ${event.title} (ID: ${data.id})`);
        onClose();
      })
      .catch((error) => {
        console.error('Error adding event:', error);
        setError('An error occurred while adding the event.');
      });
  };  
  
  if (!isOpen) return null;

  return (
    <div className="add-event-modal-overlay" ref={ref}>
      <div className="add-event-modal-content">
        <h2 className="add-event-title">
          Add New Event
          <span className="add-event-close-button" onClick={onClose}>×</span>
        </h2>
        <form onSubmit={handleSubmit} className="add-event-form">
          <label className="add-event-label">
            Title:
            <input
              type="text"
              name="title"
              className="add-event-input"
              value={event.title}
              onChange={handleChange}
              placeholder="Event Title"
              required
            />
          </label>
          <label className="add-event-label">
            Date:
            <input
              type="date"
              name="date"
              className="add-event-input"
              value={event.date}
              onChange={handleChange}
              required
            />
          </label>
          <label className="add-event-label">
            Time:
            <input
              type="time"
              name="time"
              className="add-event-input"
              value={event.time}
              onChange={handleChange}
              required
            />
          </label>
          <label className="add-event-label">
            Description:
            <textarea
              name="description"
              className="add-event-textarea"
              value={event.description}
              onChange={handleChange}
              placeholder="Event Description (Displays up to 1,000 words)"
              required
            />
          </label>
          <label className="add-event-label">
            Event Photo:
            <input
              type="file"
              name="photo"
              className="add-event-input"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <p className="add-event-file-info">
              Size limit: 2MB. Accepted formats: .jpg, .jpeg, .png
            </p>
          </label>
          {error && <p className="add-event-error">{error}</p>}
          <div className="add-event-buttons">
            <button type="submit" className="add-event-save-button">Add Event</button>
            <button type="button" className="add-event-cancel-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default AddEvent;
