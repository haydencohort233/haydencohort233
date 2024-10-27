const { createTaggedLogger } = require('./logger');

// Generic function to log vendor actions to combined.log with tags
const logVendorAction = (action, vendorName, vendorId) => {
  try {
    const logger = createTaggedLogger('vendor'); // Create a tagged logger for vendors
    const logMessage = `${action} by vendor: ${vendorName} (ID: ${vendorId})`;

    logger.info(logMessage);
    console.log(`Log entry added: ${logMessage}`); // Confirm log entry addition for debugging
  } catch (error) {
    console.error(`Failed to log action: ${error.message}`); // Handle error if logger instantiation fails
    throw new Error('Logging failed');
  }
};

module.exports = { logVendorAction };
