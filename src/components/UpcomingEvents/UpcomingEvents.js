import React, { useEffect, useState } from 'react';
import './UpcomingEvents.css';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events/upcoming?limit=2') // Fetch only the next 2 events
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  return (
    <div className="upcoming-events">
      <h2>Upcoming Events</h2>
      <ul>
        {events.map((event, index) => (
          <li key={event.id} className={`event-item event-${index + 1}`}>
            <h3>{event.title}</h3>
            <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingEvents;
