import React, { useEffect } from 'react';
import './ViewGuest.css';

const ViewGuest = ({ guest, isOpen, onClose }) => {
  // Close the modal when the escape key is pressed
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent interaction when modal is not open
  if (!isOpen || !guest) {
    return null;
  }

  return (
    <div className="guest-modal-overlay" onClick={onClose}>
      <div
        className="guest-modal"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="guest-details">
          <h2 className="guest-name">{guest.name}</h2>
          {guest.guestphoto && (
            <img
              src={guest.guestphoto}
              alt={`${guest.name}`}
              className="guest-photo"
            />
          )}
          <p className="guest-description">{guest.description || 'No description available.'}</p>
          <div className="guest-schedule">
            <strong>Schedule:</strong> {guest.schedule}
          </div>
          {guest.break ? (
            <div className="guest-status break-status">Currently on break</div>
          ) : (
            <div className="guest-status open-status">Currently open</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewGuest;
