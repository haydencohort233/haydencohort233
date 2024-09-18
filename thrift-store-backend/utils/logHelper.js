const fs = require('fs');
const path = require('path');

// Log file path
const logFilePath = path.join(__dirname, '../logs/actions.log');

// Helper function to format the timestamp
const formatTimestamp = () => {
  const now = new Date();

  // Format the date as MM-DD-YYYY
  const date = now.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  // Format the time as HH:MM:SS AM/PM
  const time = now.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return `[${date}][${time}]`;
};

// Log action with formatted timestamp, action, guest name, guest ID, and admin username
const logAction = (action, guestName, guestId, adminUsername = 'Unknown Admin') => {
  const timestamp = formatTimestamp();
  
  // Format the log message to include both guest name and guest ID
  const logMessage = `[${adminUsername}]${timestamp} - ${action}: ${guestName} (ID: ${guestId})\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

module.exports = { logAction };
