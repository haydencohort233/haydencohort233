import React, { useEffect, useState } from 'react';
import './UpcomingEvents.css';
import ViewEvent from '../ViewEvent/ViewEvent';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hours12 = ((+hours % 12) || 12).toString();
    const suffix = +hours < 12 ? 'AM' : 'PM';
    return `${hours12}:${minutes}${suffix}`;
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/events/upcoming?limit=3')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch upcoming events');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched events:', data);
        setEvents(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError('Failed to load upcoming events');
        setIsLoading(false);
        console.error('Error fetching events:', error);
      });
  }, []);

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.png';
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="upcoming-events">
      {isLoading ? (
        <div className="loading-message">Loading upcoming events...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <ul>
          {events.map((event) => {
            const titlePhoto = event.title_photo
              ? `http://localhost:5000${event.title_photo}` + (event.title_photo.endsWith('.png') || event.title_photo.endsWith('.jpg') ? '' : '.png')
              : '/images/placeholder.png';

            return (
              <li
                key={event.id}
                className="event-item"
                onClick={() => handleEventClick(event)}
              >
                <div className="event-photo">
                  <img
                    src={titlePhoto}
                    alt={event.title}
                    onError={handleImageError}
                  />
                </div>
                <div className="event-details">
                  <h3>{event.title}</h3>
                  <p className="event-datetime">
                    {new Date(event.date).toLocaleDateString()} at{' '}
                    {formatTime(event.time)}
                  </p>
                  <p className="preview-text">{event.preview_text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {selectedEvent && (
        <ViewEvent event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default UpcomingEvents;
