const { createTaggedLogger } = require('../utils/logger');

exports.logVendorAction = (req, res) => {
  const { username, action, logType } = req.body;

  if (username && action) {
    try {
      const logLocation = logType || 'vendor';
      const logger = createTaggedLogger(logLocation);
      const logMessage = `${action} by vendor: ${username}`;

      logger.info(logMessage);
      res.status(200).json({ message: 'Action logged successfully' });
    } catch (error) {
      console.error(`Failed to log action: ${error.message}`);
      res.status(500).json({ error: 'Failed to log action' });
    }
  } else {
    res.status(400).json({ error: 'Username and action are required' });
  }
};

// General logging function to be used across different controllers
exports.logAction = (logType, message, metadata = {}) => {
  try {
    const logger = createTaggedLogger(logType || 'info');
    logger.info(message, metadata);
    console.log(`Log entry added: ${message}`);
  } catch (error) {
    console.error(`Failed to log action: ${error.message}`);
    throw new Error('Logging failed');
  }
};
