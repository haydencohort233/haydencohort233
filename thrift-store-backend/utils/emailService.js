// emailService.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendConfirmationEmail = async (to, subject, text, html) => {
    try {
        const msg = {
            to: to, // Recipient email address
            from: 'throwaway190732@gmail.com',
            subject: subject,
            text: text,
            html: html,
            replyTo: 'throwaway190732@gmail.com',
        };

        const response = await sgMail.send(msg);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendConfirmationEmail;
