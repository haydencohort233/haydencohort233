const express = require('express');
const { logVendorAction } = require('../controllers/logsController');
const validLogTypes = require('../utils/logTypesConfig.json').validLogTypes;
const router = express.Router();

// Route to handle vendor-specific logging actions using logVendorAction from logsController
// Example usage: When a vendor logs in or updates their information, call this endpoint to log the action
// Endpoint: /api/logs/log-vendor-action
router.post('/log-vendor-action', logVendorAction);

// General logging route for different log types, such as server, email, etc.
// Use this route to log actions that are not vendor-specific
// Example: POST /api/logs/log-action with body { "logType": "server", "message": "Server started successfully." }
router.post('/log-action', (req, res) => {
    const { logType, message } = req.body;
    console.log('Received log action request:', { logType, message });

    // Validate required fields
    if (!logType || !message) {
        console.error(`Missing required fields: logType=${logType}, message=${message}`);
        return res.status(400).json({ error: 'logType and message are required' });
    }

    // Validate logType if provided
    if (!validLogTypes.includes(logType)) {
        console.error(`Invalid logType provided: ${logType}`);
        return res.status(400).json({ error: `Invalid logType provided. Valid options are: ${validLogTypes.join(', ')}` });
    }

    try {
        // Use vendorLogger if logType is 'vendor', else create a dynamic logger
        const logger = logType === 'vendor' ? vendorLogger : createTaggedLogger(logType);
        logger.info(message);
        res.status(200).json({ message: 'Action logged successfully' });
    } catch (error) {
        console.error('Failed to log action:', error.message);
        res.status(500).json({ error: 'Failed to log action' });
    }
});

// Export the router to be used in the main server file
// Example: app.use('/api/logs', logRoutes);
module.exports = router;
