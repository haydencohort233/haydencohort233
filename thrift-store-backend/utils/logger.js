const winston = require('winston');

// Set up Winston logger
const logger = winston.createLogger({
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
        return `${time} ${date}`;  // Format as "3:55PM 10/17/24"
      },
    }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      return `[${timestamp}][${level.toUpperCase()}] ${stack || message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Add colors to console output
        winston.format.printf(({ level, message, timestamp, stack }) => {
          return `[${timestamp}][${level}] ${stack || message}`;
        })
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Handle uncaught exceptions
logger.exceptions.handle(
  new winston.transports.File({ filename: 'logs/exceptions.log' })
);

// Handle unhandled rejections
logger.rejections.handle(
  new winston.transports.File({ filename: 'logs/rejections.log' })
);

module.exports = logger;
