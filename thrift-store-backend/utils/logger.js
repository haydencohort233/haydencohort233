const winston = require('winston');
const path = require('path');

// Define custom colors for log levels and log types
winston.addColors({
  debug: 'blue',
  info: 'green',
  warn: 'yellow',
  error: 'red',
  vendor: 'magenta',
  server: 'cyan',
  email: 'blue',
});

// Utility function to create a single logger that writes to combined.log with tags
const createTaggedLogger = (logType) => {
  const logFilePath = path.join(__dirname, '../logs/combined.log');

  // Apply color to the logType in console transport
  const colorizeLogType = (logType) => {
    switch (logType.toLowerCase()) {
      case 'vendor':
        return `\x1b[35m${logType.toUpperCase()}\x1b[0m`; // Magenta
      case 'server':
        return `\x1b[36m${logType.toUpperCase()}\x1b[0m`; // Cyan
      case 'email':
        return `\x1b[34m${logType.toUpperCase()}\x1b[0m`; // Blue
      case 'error':
        return `\x1b[31m${logType.toUpperCase()}\x1b[0m`; // Red
      default:
        return `${logType.toUpperCase()}`; // Default no color
    }
  };

  return winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    format: winston.format.combine(
      winston.format.timestamp({
        format: () => {
          const now = new Date();
          const time = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }).format(now);
          const date = new Intl.DateTimeFormat('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
          }).format(now);
          return `${time} ${date}`; // Format as "3:55PM 10/17/24"
        },
      }),
      winston.format.printf(({ level, message, timestamp, stack }) => {
        return `[${timestamp}][${level.toUpperCase()}][${logType.toUpperCase()}] ${stack || message}`;
      })
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.printf(({ level, message, timestamp, stack }) => {
            const coloredLogType = colorizeLogType(logType); // Get the log type colorized without adding additional brackets
            return `[${timestamp}][${level}][${coloredLogType}] ${stack || message}`;
          })
        ),
      }),
      new winston.transports.File({ filename: logFilePath, level: 'info' }),
    ],
  });
};

module.exports = {
  createTaggedLogger,
};
