const { createLoggerWithFile } = require('../utils/logger');

exports.logVendorAction = (req, res) => {
  const { username, action, logType } = req.body;

  if (username && action) {
    const logLocation = logType || 'error';
    const logger = createLoggerWithFile(logLocation);
    logger.info(`${username} performed action: ${action}`);
    res.status(200).json({ message: 'Action logged successfully' });
  } else {
    res.status(400).json({ error: 'Username and action are required' });
  }
};
