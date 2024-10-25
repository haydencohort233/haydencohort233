const sgMail = require('@sendgrid/mail');
const winston = require('winston');
const { generateLoyaltyEmail } = require('./emailTemplates');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Set up Winston for logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/email-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/email-info.log', level: 'info' }),
  ],
});

// Function to send a generic email
const sendConfirmationEmail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to, // Recipient email address
      from: 'throwaway190732@gmail.com', // Your verified sender email
      subject,
      text,
      html,
      replyTo: 'throwaway190732@gmail.com',
    };

    const response = await sgMail.send(msg);
    logger.info(`Email sent successfully to ${to}`, { subject, response });
    return response;
  } catch (error) {
    // Log the full error response for debugging
    logger.error(`Error sending email to ${to}: ${error.response ? JSON.stringify(error.response.body) : error.message}`, { subject, error });
    throw error;
  }
};

// Function to send a loyalty email
const sendLoyaltyEmail = async (to, firstName, lastName, loyaltyPoints, rewardDetails, includePromoCode = false) => {
  const { subject, text, html } = generateLoyaltyEmail(firstName, lastName, loyaltyPoints, rewardDetails, includePromoCode);
  return sendConfirmationEmail(to, subject, text, html);
};

// Export both email functions
module.exports = {
  sendConfirmationEmail,
  sendLoyaltyEmail,
};
