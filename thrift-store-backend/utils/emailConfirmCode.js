// utils/emailConfirmCode.js
const crypto = require('crypto');

/**
 * Generates a random alphanumeric confirmation code, including special characters.
 * @param {number} length - The length of the confirmation code (default is 10)
 * @param {boolean} includeSpecialChars - Include special characters (default is true)
 * @returns {string}
 */
const generateConfirmationCode = (length = 10, includeSpecialChars = true) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()';
    const characters = letters + numbers + (includeSpecialChars ? specialChars : '');

    let confirmationCode = '';
    for (let i = 0; i < length; i++) {
        // Use a cryptographically secure random value
        const randomIndex = crypto.randomInt(0, characters.length);
        confirmationCode += characters.charAt(randomIndex);
    }
    return confirmationCode;
};

module.exports = generateConfirmationCode;
