import React from 'react';
import './GuestStatus.css';

const GuestStatus = ({ guest }) => {
  const { name, guestphoto, description, schedule, break: isOnBreak } = guest;

  // Helper function to convert 12-hour format time to minutes since midnight
  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.toLowerCase().split(/([apm]+)/).filter(Boolean);
    let [hours, minutes] = timePart.split(':').map(Number);
    if (isNaN(minutes)) minutes = 0; // Default minutes to 0 if not provided

    if (modifier === 'pm' && hours !== 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;

    return hours * 60 + minutes; // Total minutes since midnight
  };

  // Parse the schedule to get open and close times in 24-hour format
  const parseSchedule = (schedule) => {
    const times = schedule.match(/(\d{1,2}(?::\d{2})?\s?[apmAPM]+)/g);
    if (times && times.length === 2) {
      const [openTime, closeTime] = times.map((time) => convertTo24HourFormat(time));
      return { openTime, closeTime };
    }
    return null;
  };

  // Check if the vendor is open based on the schedule and break status
  const checkIfOpen = () => {
    const scheduleTimes = parseSchedule(schedule);
    if (!scheduleTimes || isOnBreak) {
      return false; // Closed if no schedule is available or the vendor is on break
    }

    const { openTime, closeTime } = scheduleTimes;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes since midnight

    return currentTime >= openTime && currentTime < closeTime;
  };

  const isOpen = checkIfOpen();
  const statusClass = isOpen ? 'status-open' : 'status-closed';

  // Set the guest photo or fallback to a default image
  const photoURL = guestphoto ? `http://localhost:5000${guestphoto}` : `${process.env.PUBLIC_URL}/images/avatar.png`;

  return (
    <div className={`guest-status ${statusClass}`}>
      <div className="guest-status-thumbnail">
        <img src={photoURL} alt={name} className="guest-photo" />
      </div>
      <div className="guest-status-info">
        <h4 className="guest-status-name">{name}</h4>
        <p className="guest-status-description">{description || 'No description available.'}</p>
        <span className="guest-status-schedule">{schedule.replace(",", " - ")}</span>
      </div>
    </div>
  );
};

export default GuestStatus;
