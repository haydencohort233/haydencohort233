const winston = require('winston');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
require('dotenv').config(); // Load environment variables

// Define custom colors for log levels and log types
/*
  winston.addColors: Custom log colors are assigned to differentiate log levels visually.
  This helps quickly identify the type of log in console outputs. The colors specified here will be used by Winston's colorize function 
  to highlight different log levels when logs are displayed in the console.
*/
winston.addColors({
  debug: 'blue',
  info: 'green',
  warn: 'yellow',
  error: 'red',
  vendor: 'magenta',
  server: 'cyan',
  email: 'blue',
});

// Utility function to create a single logger that writes to monthly rotating log files with tags
/*
  createTaggedLogger: This function serves as the core utility to create different loggers based on provided tags (log types).
  It accepts a logType (e.g., 'server', 'vendor', 'shop') and additional configuration options.
  
  Options supported:
  - dirname: Specifies the directory where log files should be saved. Default is '../logs'.
  - maxFiles: Defines how many rotated log files to retain. Default is 30 days, configurable through the environment variable.
  - filename: Specifies the naming format for log files, defaulting to 'combined-%DATE%.log'.
  - level: Sets the logging level for this particular logger. Default is 'info', configurable through the environment variable.

  Example usage:
  const myLogger = createTaggedLogger('server', { level: 'debug', maxFiles: '60' });

  By centralizing logger creation in this way, it's easy to adjust configurations for all loggers from a single function.
*/
const createTaggedLogger = (logType, options = {}) => {
  // Set up log directory, filename, and other default settings
  const logDir = options.dirname || process.env.LOG_DIRNAME || path.join(__dirname, '../logs');
  const maxFiles = options.maxFiles || process.env.LOG_MAX_FILES || '30'; // Keep logs for 30 days by default
  const filename = options.filename || `combined-%DATE%.log`;
  const level = options.level || process.env.LOG_LEVEL || 'info';

  return winston.createLogger({
    level: level,
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
            return `[${timestamp}][${level}][${logType.toUpperCase()}] ${stack || message}`;
          })
        ),
      }),
      new DailyRotateFile({
        filename: filename,
        dirname: logDir,
        datePattern: 'YYYY-MM-DD', // Rotate logs daily
        maxFiles: maxFiles, // Set maxFiles retention based on environment variable or option
        zippedArchive: true,
        auditFile: path.join(logDir, 'audit/audit-log.json'), // Store audit log in the same directory
      }),
    ],
  });
};

/*
  serverLogger: This logger is used to record actions and events occurring at the server level.
  It captures general server operations, request handling, errors, and all backend operations that aren't directly tied
  to a specific user action like those performed by vendors or customers.

  Examples:
    - 'Server running on http://localhost:5000'
    - 'Connected to the database'
    - 'Incoming request: Method = GET, URL = /api/guests, IP = ::ffff:127.0.0.1'
    - 'Error processing payment: Insufficient funds'

  This logger ensures that all server-level events are documented and available for diagnostics and monitoring.
  It is valuable for understanding server performance, error states, and for troubleshooting server-related issues.
*/
const serverLogger = createTaggedLogger('server', {
  filename: 'server-%DATE%.log',
  dirname: path.join(__dirname, '../logs/server'),
  datePattern: 'YYYY-MM-DD', // Rotate logs daily
  maxFiles: process.env.LOG_MAX_FILES || '30',
  zippedArchive: true,
});

/*
  vendorLogger: This logger is used to record actions specifically related to logged-in vendors.
  Use this logger to track any activity vendors are performing that affects data related to them.

  Examples:
    - 'lovemorgue has updated Event (ID: 6 Scooby-Doo!)'
    - 'chasingnostalgia has logged in'
    - 'valley3dprints has logged out'
    - 'lovemorgue has updated vendor information for Love Morgue'

  This logger ensures that vendor-specific activities are stored separately,
  making it easier to analyze their actions without mixing them with other server or system-level logs.
*/
const vendorLogger = createTaggedLogger('vendor', {
  filename: 'vendors-%DATE%.log',
  dirname: path.join(__dirname, '../logs/vendors'),
  datePattern: 'YYYY-MM-DD', // Rotate logs daily
  maxFiles: process.env.LOG_MAX_FILES || '30',
  zippedArchive: true,
});

/*
  shopLogger: This logger is used to log interactions in the shop.
  These interactions can be by any user, including guests (non-logged-in users) or logged-in users.

  Examples:
    - 'Guest has purchased a ticket (guestemail@gmail.com) QTY: 1'
    - 'Registered user john@example.com has purchased an item'

  This logger keeps track of customer activity (such as ticket or product purchases) that occur in the shop,
  regardless of whether the user is logged in. It is especially useful for tracking transactions.
*/
const shopLogger = createTaggedLogger('shop', {
  filename: 'shop-%DATE%.log',
  dirname: path.join(__dirname, '../logs/shop'),
  datePattern: 'YYYY-MM-DD', // Rotate logs daily
  maxFiles: process.env.LOG_MAX_FILES || '30',
  zippedArchive: true,
});

// logRequest Middleware:
/*
  logRequest: Middleware function that logs all incoming HTTP requests to the server.
  This middleware captures:
  - HTTP method (e.g., GET, POST)
  - URL of the request
  - IP address of the client
  - Status code returned by the server
  - Duration of the request in milliseconds

  This middleware helps in tracing all HTTP requests and analyzing server performance.
  It leverages serverLogger to log general server-level events.

  Example usage:
  app.use(logRequest); // Should be used before all route definitions to ensure every request is logged.
*/
const logRequest = (req, res, next) => {
  const { method, url, ip } = req;

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    serverLogger.info(`Incoming request: Method = ${method}, URL = ${url}, IP = ${ip}, Status = ${statusCode}, Duration = ${duration}ms`);
  });

  next();
};

module.exports = {
  createTaggedLogger,
  serverLogger,
  vendorLogger,
  shopLogger,
  logRequest,
};
