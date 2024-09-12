import React, { useState, useEffect } from 'react';
import './GuestCard.css';
import ViewGuest from '../ViewGuest/ViewGuest';

const GuestCard = ({ guest }) => {
  const { name, guestavatar, description, schedule, break: isOnBreak } = guest;

  // State to manage the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const baseURL = 'http://localhost:5000';
  const avatarURL = guestavatar ? `${baseURL}${guestavatar}` : '/public/images/avatar.png';

  // Parse the schedule to get open and close times in 24-hour format
  const parseSchedule = (schedule) => {
    // Example schedule: "12pm to 6pm"
    const times = schedule.match(/(\d{1,2}(?::\d{2})?\s?[apmAPM]+)/g); // Matches times like "12pm" or "6:00pm"
    if (times && times.length === 2) {
      const [openTime, closeTime] = times.map((time) => convertTo24HourFormat(time));
      return { openTime, closeTime };
    }
    return null;
  };

  // Convert 12-hour format time to minutes since midnight
  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.toLowerCase().split(/([apm]+)/).filter(Boolean);
    let [hours, minutes] = timePart.split(':').map(Number);
    if (isNaN(minutes)) minutes = 0;

    if (modifier === 'pm' && hours !== 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;

    return hours * 60 + minutes; // Returns total minutes since midnight
  };

  const checkOpenStatus = () => {
    if (isOnBreak) {
      setIsOpen(false);
      return;
    }

    const scheduleTimes = parseSchedule(schedule);
    if (!scheduleTimes) {
      setIsOpen(false);
      return;
    }

    const { openTime, closeTime } = scheduleTimes;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    setIsOpen(currentTime >= openTime && currentTime < closeTime);
  };

  // Check the status periodically
  useEffect(() => {
    checkOpenStatus();

    const interval = setInterval(() => {
      checkOpenStatus();
    }, 60000);

    return () => clearInterval(interval);
  }, [schedule, isOnBreak]);

  const statusText = isOpen ? 'Open' : 'Closed';
  const statusClass = isOpen ? 'status-open' : 'status-closed';

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
