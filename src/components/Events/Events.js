import React, { useEffect, useState } from 'react';
import AddEvent from '../AddEvent/AddEvent';
import AddGuest from '../AddGuest/AddGuest'; // Import AddGuest component
import './Events.css';
import Header from '../Header/Header';
import GuestCard from '../GuestCard/GuestCard';
import '../AddGuest/AddGuest.css'; // Import AddGuest.css for Add Guest button styles

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false); // State for AddGuest modal
  const [guestVendors, setGuestVendors] = useState([]);
  const [eventError, setEventError] = useState('');
  const [guestVendorError, setGuestVendorError] = useState('');

  useEffect(() => {
    // Fetch events within the next 3 months
    fetch('http://localhost:5000/api/events/upcoming?range=3')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        return response.json();
      })
      .then((data) => setEvents(data))
      .catch((error) => {
        setEventError('Failed to load Events');
        console.error('Error fetching events:', error);
      });

    // Fetch guest vendors
    fetch('http://localhost:5000/api/guests')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch guest vendors');
        }
        return response.json();
      })
      .then((data) => setGuestVendors(data))
      .catch((error) => {
        setGuestVendorError('Failed to load Guest Vendors');
        console.error('Error fetching guest vendors:', error);
      });
  }, []);

  const handleOpenAddEvent = () => {
    setIsAddEventOpen(true);
  };

  const handleCloseAddEvent = () => {
    setIsAddEventOpen(false);
  };

  const handleOpenAddGuest = () => {
    setIsAddGuestOpen(true);
  };

  const handleCloseAddGuest = () => {
    setIsAddGuestOpen(false);
  };

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.png';
  };

  return (
    <div className="events">
      <Header />
      <div className="error-messages">
        {eventError && <div className="event-error-message">{eventError}</div>}
        {guestVendorError && <div className="guest-vendor-error">{guestVendorError}</div>}
      </div>
      <div className="guest-vendors-section">
        {guestVendors.length === 0 && !guestVendorError ? (
          <div className="loading-message">Loading guest vendors...</div>
        ) : (
          guestVendors.map((guest) => <GuestCard key={guest.id} guest={guest} />)
        )}
      </div>
      <div className="events-content">
        <div className="button-group">
          <button className="add-event-button" onClick={handleOpenAddEvent}>
            Add Event
          </button>
          <button className="add-guest-button" onClick={handleOpenAddGuest}>
            Add Guest
          </button>
        </div>
        <ul className="event-list">
          {events.length === 0 && !eventError ? (
            <div className="loading-message">Loading upcoming events...</div>
          ) : (
            events.map((event) => {
              const titlePhoto = event.title_photo
                ? `http://localhost:5000${event.title_photo}${event.title_photo.endsWith('.png') || event.title_photo.endsWith('.jpg') ? '' : '.png'}`
                : '/images/placeholder.png';

              return (
                <li key={event.id} className="event-item">
                  <h2 className="event-title">{event.title}</h2>
                  <p className="event-date">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                  <p className="event-description">{event.description}</p>
                  <img
                    src={titlePhoto}
                    alt={event.title}
                    className="event-photo"
                    onError={handleImageError}
                  />
                </li>
              );
            })
          )}
        </ul>
      </div>

      <AddEvent isOpen={isAddEventOpen} onClose={handleCloseAddEvent} />
      <AddGuest isOpen={isAddGuestOpen} onClose={handleCloseAddGuest} />
    </div>
  );
};

export default Events;
