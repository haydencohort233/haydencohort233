import React, { useEffect, useState } from 'react';
import './ViewGuest.css';

const ViewGuest = ({ guest, isOpen, onClose }) => {
  const { name, guestphoto, description, schedule, break: isOnBreak } = guest;
  const [isOpenStatus, setIsOpenStatus] = useState(false);

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

  // Parse the schedule to get open and close times in minutes since midnight
  const parseSchedule = (schedule) => {
    // Match times in either 12-hour (e.g., "12:00pm") or 24-hour (e.g., "12:00") format
    const times = schedule.match(/(\d{1,2}(?::\d{2})?\s?[apmAPM]*)/g);
    if (times && times.length === 2) {
      const [openTime, closeTime] = times.map(convertTo24HourFormat);
      return { openTime, closeTime };
    }
    return null;
  };

  // Convert 12-hour format (with AM/PM) to minutes since midnight
  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.toLowerCase().split(/([apm]+)/).filter(Boolean);
    let [hours, minutes] = timePart.split(':').map(Number);
    if (isNaN(minutes)) minutes = 0;

    if (modifier === 'pm' && hours !== 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;

    return hours * 60 + minutes; // Returns total minutes since midnight
  };

  // Function to check if the current time falls within the open hours
  const checkOpenStatus = () => {
    if (isOnBreak) {
      setIsOpenStatus(false);
      return;
    }

    const scheduleTimes = parseSchedule(schedule);
    if (!scheduleTimes) {
      setIsOpenStatus(false);
      return;
    }

    const { openTime, closeTime } = scheduleTimes;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Check if current time is between open and close times
    setIsOpenStatus(currentTime >= openTime && currentTime < closeTime);
  };

  // Check the status periodically
  useEffect(() => {
    checkOpenStatus(); // Initial check

    const interval = setInterval(() => {
      checkOpenStatus(); // Check every minute
    }, 60000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [schedule, isOnBreak]);

  // Prevent interaction when modal is not open
  if (!isOpen || !guest) {
    return null;
  }

  // Construct the full URL for the guestphoto
  const baseURL = 'http://localhost:5000';
  const photoURL = guestphoto ? `${baseURL}${guestphoto}` : '/public/images/avatar.png';

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
          <h2 className="guest-name">{name}</h2>
          {guestphoto && (
            <img
              src={photoURL} // Use the constructed URL here
              alt={`${name}`}
              className="guest-photo"
            />
          )}
          <p className="guest-description">{description || 'No description available.'}</p>
          <div className="guest-schedule">
            <strong>Schedule:</strong> {schedule}
          </div>
          {isOnBreak ? (
            <div className="guest-status break-status">Currently on break</div>
          ) : isOpenStatus ? (
            <div className="guest-status open-status">Currently open</div>
          ) : (
            <div className="guest-status closed-status">Currently closed</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewGuest;
