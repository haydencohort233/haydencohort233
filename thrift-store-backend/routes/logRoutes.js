const express = require('express');
const { createTaggedLogger } = require('../utils/logger');
const validLogTypes = require('../utils/logTypesConfig.json').validLogTypes;
const router = express.Router();

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
        const logger = createTaggedLogger(logType);
        logger.info(message);
        res.status(200).json({ message: 'Action logged successfully' });
    } catch (error) {
        console.error('Failed to log action:', error.message);
        res.status(500).json({ error: 'Failed to log action' });
    }
});

module.exports = router;
