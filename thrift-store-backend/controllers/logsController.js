const { vendorLogger } = require('../utils/logger');

/**
 * logVendorAction:
 * This function is used to log vendor-specific actions. 
 * It captures the username and action taken, and logs the message using the vendorLogger.
 * - **How to implement in other files**:
 *   1. Import the `logVendorAction` function from this file.
 *   2. Use it when you need to log any action taken by a vendor, such as updating an event or logging in.
 *   3. Ensure you provide `username` and `action` fields in the request body.
 *
 * Example usage:
 * ```javascript
 * const { logVendorAction } = require('../controllers/logsController');
 *
 * app.post('/some-route', (req, res) => {
 *   // Perform some action
 *   logVendorAction(req, res); // Log the action
 * });
 * ```
 */
exports.logVendorAction = (req, res) => {
  const { username, action } = req.body;

  if (!username || !action) {
    console.error(`Missing required fields: username=${username}, action=${action}`);
    return res.status(400).json({ error: 'Username and action are required' });
  }

  try {
    const logMessage = `${username} ${action}`;
    vendorLogger.info(logMessage);
    res.status(200).json({ message: 'Action logged successfully' });
  } catch (error) {
    vendorLogger.error(`Failed to log action: ${error.message}`);
    res.status(500).json({ error: 'Failed to log action' });
  }
};

/**
 * logAction:
 * General-purpose logging function that can be used across different controllers to log messages.
 * It accepts a `logType` to determine the logger type, a `message` to log, and optional metadata.
 * - **How to implement in other files**:
 *   1. Import the `logAction` function from this file.
 *   2. Call `logAction()` whenever you need to log an event, specifying the `logType` (e.g., 'server', 'vendor', etc.) and a descriptive `message`.
 *   3. Include additional metadata if needed for better context.
 *
 * Example usage:
 * ```javascript
 * const { logAction } = require('../controllers/logsController');
 *
 * function someFunction() {
 *   // Perform some operations
 *   logAction('server', 'Operation completed successfully', { additional: 'info' });
 * }
 * ```
 */
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
