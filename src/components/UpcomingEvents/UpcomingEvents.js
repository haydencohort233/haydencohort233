import React, { useEffect, useState } from 'react';
import './UpcomingEvents.css';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/events/upcoming?limit=2')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch upcoming events');
        }
        return response.json();
      })
      .then(data => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch(error => {
        setError('Failed to load upcoming events');
        setIsLoading(false);
        console.error('Error fetching events:', error);
      });
  }, []);

  return (
    <div className="upcoming-events">
      <h2>Upcoming Events</h2>
      {isLoading ? (
        <div className="loading-message">Loading upcoming events...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <ul>
          {events.map((event, index) => (
            <li key={event.id} className={`event-item event-${index + 1}`}>
              {event.photo_url && (
                <img
                  src={`http://localhost:5000${event.photo_url}`}
                  alt={event.title}
                  className="event-photo"
                  onError={(e) => {
                    console.error('Failed to load event image:', e.target.src);
                    e.target.style.display = 'none'; // Hide image if loading fails
                  }}
                />
              )}
              <div className="event-details">
                <h3>{event.title}</h3>
                <p>
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpcomingEvents;
