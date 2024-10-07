// utils/emailTemplates.js

/**
 * Generates the subject and body of the email for ticket purchase confirmation
 * @param {string} firstName - The first name of the recipient
 * @param {string} lastName - The last name of the recipient
 * @param {string} eventName - The name of the event
 * @param {number} quantity - The number of tickets purchased
 * @returns {object} - An object containing the subject, text, and HTML content
 */
const generateTicketPurchaseEmail = (firstName, lastName, eventName, quantity) => {
    const subject = `Your tickets for ${eventName}`;

    const text = `Hi ${firstName} ${lastName},\n\nThank you for purchasing ${quantity} tickets to ${eventName}!\n\nWe appreciate your support and look forward to seeing you at the event.\n\n- Chasing Nostalgia, John & Brittney`;

    const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
    <!-- Header with Logo -->
    <div style="text-align: center; background-color: #f8f8f8; padding: 10px;">
        <img src="https://drive.google.com/uc?export=view&id=1jCw4mbU2--91ZSxRIQ554hpa9s1Gppn5" alt="Chasing Nostalgia Logo" style="max-width: 200px;">
    </div>

        <!-- Main Content -->
        <div style="padding: 20px;">
            <h2 style="color: #2c3e50;">Hi ${firstName} ${lastName},</h2>
            <p>Thank you for purchasing <strong>${quantity}</strong> tickets to <strong>${eventName}</strong>!</p>
            <p>We can't wait to have you join us for this exciting event. Your support means a lot to us!</p>
        </div>

        <!-- Dynamic Section: Optional Fun Content -->
        <div style="padding: 20px; background-color: #f0f0f0; margin-top: 10px;">
            <h3 style="color: #e67e22;">Special Offer Just For You!</h3>
            <p>As a token of our appreciation, here's a discount code for your next event: <strong>SAVE10</strong></p>
            <p>Quote of the day: "The best way to predict the future is to create it."</p>
        </div>

        <!-- Footer with Mascot, Thank You Message, and Social Media Links -->
        <div style="padding: 20px; background-color: #2c3e50; color: #fff; text-align: center;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p>Thank you for being part of the Chasing Nostalgia community!</p>
                    <p style="margin: 0;">- John & Brittney</p>
                </div>
<!-- Footer with Mascot -->
<img src="https://drive.google.com/uc?export=view&id=1KxslqPX0kJlDcNfxc00iz74YoD97wwz7" alt="Mascot Image" style="max-width: 100px;">
            </div>
            <div style="margin-top: 20px;">
                <p>Follow us on Instagram: <a href="https://instagram.com/chasingnostalgia__" style="color: #e67e22;">chasingnostalgia__</a></p>
                <p>Visit our Website: <a href="https://www.google.com" style="color: #e67e22;">Chasing Nostalgia</a></p>
            </div>
        </div>
    </div>`;

    return { subject, text, html };
};

module.exports = {
    generateTicketPurchaseEmail,
};
