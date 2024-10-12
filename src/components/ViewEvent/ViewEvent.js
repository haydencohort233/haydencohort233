import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewEvent.css';

const ViewEvent = ({ event, onClose }) => {
  const navigate = useNavigate();

  // Function to format time to 10:00AM or 1:00PM
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hours12 = ((+hours % 12) || 12).toString();
    const suffix = +hours < 12 ? 'AM' : 'PM';
    return `${hours12}:${minutes}${suffix}`;
  };

  // Close modal on ESC key or outside click
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', onClose);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  // Image error fallback to placeholder
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.png';
  };

  const handleViewTicketsClick = () => {
    // Redirect to ViewTickets page with event data
    navigate('/view-tickets', {
      state: {
        eventId: event.id,
        eventName: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventDescription: event.description,
        eventPhoto: event.photo_url,
      },
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>{event.title}</h2>
        <p className="event-datetime">
          {new Date(event.date).toLocaleDateString()} at {formatTime(event.time)}
        </p>
        <hr className="divider" />
        <p>{event.description}</p>
        <img
          src={event.photo_url ? `http://localhost:5000${event.photo_url}` : '/images/placeholder.png'}
          alt={event.title}
          className="event-image"
          onError={handleImageError}
        />

        {event.tickets_enabled === 1 && (
          <div className="view-tickets-button-container">
            <button className="view-tickets-button" onClick={handleViewTicketsClick}>
              View Tickets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEvent;
