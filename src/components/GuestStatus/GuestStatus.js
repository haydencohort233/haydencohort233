import React from 'react';
import './GuestStatus.css';

const GuestStatus = ({ guest }) => {
  // Destructure guest properties
  const { name, guestphoto, description, schedule, break: isOnBreak } = guest;

  // Determine if the guest is open or closed based on the schedule and break status
  const isOpen = !isOnBreak && schedule.toLowerCase().includes('open');
  const statusText = isOpen ? 'Open' : 'Closed';
  const statusClass = isOpen ? 'status-open' : 'status-closed';

  // Set the guest photo URL or fall back to a placeholder image
  const photoURL = guestphoto ? `http://localhost:5000${guestphoto}` : '/public/images/avatar.png';

  return (
    <div className="guest-status">
      <div className="guest-status-info">
        <h4 className="guest-status-name">{name}</h4>
        <p className="guest-status-description">{description}</p>
        <span className={`guest-status-schedule ${statusClass}`}>{schedule}</span>
      </div>
    </div>
  );
};

export default GuestStatus;
