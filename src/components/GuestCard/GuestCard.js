import React, { useState } from 'react';
import './GuestCard.css';
import ViewGuest from '../ViewGuest/ViewGuest'; // Import the ViewGuest component

const GuestCard = ({ guest }) => {
  const { name, guestavatar, description, schedule, break: isOnBreak } = guest;

  // State to manage the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open status of the guest vendor
  const isOpen = !isOnBreak && schedule.includes('Open');
  const statusText = isOpen ? 'Open' : 'Closed';
  const statusClass = isOpen ? 'status-open' : 'status-closed';

  const baseURL = 'http://localhost:5000';
  const avatarURL = guestavatar ? `${baseURL}${guestavatar}` : '/public/images/avatar.png';

  // Handle modal open and close
  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="guest-card" onClick={handleCardClick}>
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

      <ViewGuest
        guest={guest}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default GuestCard;
