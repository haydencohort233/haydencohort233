import React, { useState, forwardRef } from 'react';
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
      setError(null); // Clear any previous error
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

    fetch('http://localhost:5000/api/events', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Event added:', data);
        onClose();
      })
      .catch((error) => {
        console.error('Error adding event:', error);
        setError('An error occurred while adding the event.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" ref={ref}>
      <div className="modal-content">
        <h2>Add New Event</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={event.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={event.date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Time:
            <input
              type="time"
              name="time"
              value={event.time}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Event Photo:
            <input
              type="file"
              name="photo"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            <p className="file-info">
              Size limit: 2MB. Accepted formats: .jpg, .jpeg, .png
            </p>
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">Add Event</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
});

export default AddEvent;
