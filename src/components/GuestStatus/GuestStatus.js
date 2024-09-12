import React from 'react';
import './GuestStatus.css';

const GuestStatus = ({ guest }) => {
  const { name, guestphoto, description, schedule, break: isOnBreak } = guest;

  // Helper function to convert 24-hour format to 12-hour format with AM/PM
  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert hour '0' to '12' for 12 AM
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Parse the schedule to format the times in 12-hour format
  const formatSchedule = (schedule) => {
    // Match times in either 12-hour (e.g., "12:00pm") or 24-hour (e.g., "12:00") format
    const times = schedule.match(/(\d{1,2}(?::\d{2})?\s?[apmAPM]*)/g);
    if (times && times.length === 2) {
      const [openTime, closeTime] = times;
      const formattedOpenTime = openTime.includes('AM') || openTime.includes('PM')
        ? openTime // Already in 12-hour format
        : convertTo12HourFormat(openTime); // Convert 24-hour to 12-hour format
      const formattedCloseTime = closeTime.includes('AM') || closeTime.includes('PM')
        ? closeTime
        : convertTo12HourFormat(closeTime);
      return `Open: ${formattedOpenTime}, Close: ${formattedCloseTime}`;
    }
    return schedule; // Return the schedule as-is if parsing fails
  };

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
        <p className="guest-status-description">{description || 'No description available.'}</p>
        <span className={`guest-status-schedule ${statusClass}`}>{formatSchedule(schedule)}</span>
      </div>
    </div>
  );
};

export default GuestStatus;
