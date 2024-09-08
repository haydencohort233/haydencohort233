// GuestCard.js
import React from 'react';
import './GuestCard.css';

const GuestCard = ({ guest }) => {
  const { name, guestavatar, description, schedule, break: isOnBreak } = guest;

  // Open status of the guest vendor
  const isOpen = !isOnBreak && schedule.includes('Open');
  const statusText = isOpen ? 'Open' : 'Closed';
  const statusClass = isOpen ? 'status-open' : 'status-closed';

  const baseURL = 'http://localhost:5000';
  const avatarURL = guestavatar ? `${baseURL}${guestavatar}` : '/public/images/avatar.png';

return (
  <div className="guest-card">
    <div className="guest-thumbnail">
      <img src={avatarURL} alt={`${name} Avatar`} />
    </div>
    <div className="guest-info">
      <h3 className="guest-name">{name}</h3>
      <p className="guest-description">{description}</p>
      <p className="guest-schedule">{schedule}</p>
      <div className={`guest-status ${statusClass}`}>{statusText}</div>
    </div>
  </div>
    );
};

export default GuestCard;
