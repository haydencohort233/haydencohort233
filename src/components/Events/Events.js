import React, { useEffect, useState } from 'react';
import './Events.css';
import Header from '../Header/Header';
import GuestCard from '../GuestCard/GuestCard';
import ViewEvent from '../ViewEvent/ViewEvent'; // Import ViewEvent
import EventCalendar from '../EventCalendar/EventCalendar'; // Import EventCalendar

const Events = () => {
  const [events, setEvents] = useState([]);
  const [guestVendors, setGuestVendors] = useState([]);
  const [eventError, setEventError] = useState('');
  const [guestVendorError, setGuestVendorError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null); // Add state for selected event

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

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.png';
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event); // Set the selected event on click
  };

  const handleCloseModal = () => {
    setSelectedEvent(null); // Reset the selected event to close modal
  };

  // Filter out guest vendors that are on break
  const filteredGuestVendors = guestVendors.filter((guest) => !guest.break);

  return (
    <>
      <Header />
      <div className="events">
        <div className="error-messages">
          {eventError && <div className="event-error-message">{eventError}</div>}
          {guestVendorError && <div className="guest-vendor-error">{guestVendorError}</div>}
        </div>
        <div className="events-layout">
          <div className="guest-vendors-section">
            {guestVendorError ? (
              <div className="error-message">{guestVendorError}</div>
            ) : filteredGuestVendors.length === 0 ? (
              <div className="no-guests-message">Currently no guest vendor</div>
            ) : (
              filteredGuestVendors.map((guest) => <GuestCard key={guest.id} guest={guest} />)
            )}
          </div>
          <div className="calendar-section">
            <EventCalendar />
          </div>
          <div className="events-content">
            <ul className="event-list">
              {events.length === 0 && !eventError ? (
                <div className="loading-message">Loading upcoming events...</div>
              ) : (
                events.map((event) => {
                  const titlePhoto = event.title_photo
                    ? `http://localhost:5000${event.title_photo}${event.title_photo.endsWith('.png') || event.title_photo.endsWith('.jpg') ? '' : '.png'}`
                    : '/images/placeholder.png';

                  return (
                    <li key={event.id} className="event-item" onClick={() => handleEventClick(event)}>
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
        </div>
      </div>

      {/* Conditionally render ViewEvent when an event is selected */}
      {selectedEvent && (
        <ViewEvent event={selectedEvent} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default Events;
