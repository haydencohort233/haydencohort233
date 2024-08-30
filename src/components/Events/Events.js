import React, { useEffect, useState } from 'react';
import AddEvent from '../AddEvent/AddEvent';
import './Events.css';
import Header from '../Header/Header';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/events/upcoming?range=3') // Fetch events within the next 3 months
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleOpenAddEvent = () => {
    setIsAddEventOpen(true);
  };

  const handleCloseAddEvent = () => {
    setIsAddEventOpen(false);
  };

  return (
    <div className="events">
      <Header />
      <button className="add-event-button" onClick={handleOpenAddEvent}>
        Add Event
      </button>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <h2>{event.title}</h2>
            <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
            <p>{event.description}</p>
            {event.photo_url && <img src={event.photo_url} alt={event.title} />}
          </li>
        ))}
      </ul>

      {/* AddEvent Modal */}
      <AddEvent isOpen={isAddEventOpen} onClose={handleCloseAddEvent} />
    </div>
  );
};

export default Events;
