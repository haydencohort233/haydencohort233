/**
 * Generates the subject and body of the email for ticket purchase confirmation
 * @param {string} firstName - The first name of the recipient
 * @param {string} lastName - The last name of the recipient
 * @param {string} eventName - The name of the event
 * @param {number} quantity - The number of tickets purchased
 * @param {string} confirmationCode - The unique confirmation code for the purchase
 * @param {string} ticketTitle - The title of the ticket purchased
 * @param {number} ticketPrice - The price of the ticket
 * @param {boolean} includeDiscountCode - Whether to include the discount code section
 * @returns {object} - An object containing the subject, text, and HTML content
 */
const generateTicketPurchaseEmail = (firstName, lastName, eventName, quantity, confirmationCode, ticketTitle, ticketPrice, includeDiscountCode = false) => {
    const subject = `Your tickets for ${eventName}`;

    const text = `Hi ${firstName} ${lastName},\n\nThank you for purchasing ${quantity} tickets to ${eventName}!\n\nTicket: ${ticketTitle}\nPrice per Ticket: $${ticketPrice.toFixed(2)}\n\nYour confirmation code is: ${confirmationCode}.\n\nPlease keep this code safe as it will help us verify your purchase if needed.\n\nWe appreciate your support and look forward to seeing you at the event.\n\n- Chasing Nostalgia, John & Brittney`;

    const discountSectionHtml = includeDiscountCode
        ? `
        <div style="padding: 20px; background: linear-gradient(to right, #6a0dad, #3cb371); margin-top: 10px; color: #000;">
            <h3 style="text-align: center;">Special Offer Just For You!</h3>
            <p>As a token of our appreciation, here's a discount code for your next event: <strong><u>SAVE10</u></strong></p>
            <p>Quote of the day: "The best way to predict the future is to create it."</p>
        </div>`
        : '';

    const html = `
    <div style="font-family: Arial, sans-serif; color: #000; background: linear-gradient(to right, #6a0dad, #0d98ba, #3cb371); padding: 20px; text-align: center;">
        <!-- Container -->
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); overflow: hidden;">

            <!-- Header with Logo -->
            <div style="text-align: center; background: linear-gradient(to right, #6a0dad, #0d98ba); padding: 10px;">
                <img src="https://drive.google.com/uc?export=view&id=1jCw4mbU2--91ZSxRIQ554hpa9s1Gppn5" alt="Chasing Nostalgia Logo" style="max-width: 350px; width: 100%; height: auto;">
            </div>

            <!-- Main Content -->
            <div style="padding: 20px; background: linear-gradient(to right, #0d98ba, #3cb371); color: #000;">
                <h2 style="text-align: center;">Hi ${firstName} ${lastName},</h2>
                <p>Thank you for purchasing <strong>${quantity}</strong> ticket(s) to <strong>${eventName}</strong>!</p>
                
                <!-- Ticket Details with Background and Border -->
                <div style="background-color: #f3f3f3; border: 1px solid #cccccc; padding: 15px; margin: 15px 0; border-radius: 5px;">
                    <p style="font-size: 1.2em; margin: 10px 0; color: #333; font-weight: bold;">${quantity} x <span style="color: #ff6f61;">${ticketTitle}</span> - <span style="color: #ff6f61;">$${ticketPrice.toFixed(2)}</span></p>
                    <p style="font-size: 1.2em; margin: 10px 0; color: #333; font-weight: bold;">Your Confirmation Code Is: <span style="color: #ff6f61;">${confirmationCode}</span></p>
                </div>

                <p>Please keep this code safe as it will help us verify your purchase if needed.</p>
            </div>

            ${discountSectionHtml}

            <!-- Footer with distinct background color -->
            <div style="padding: 20px; background: linear-gradient(to right, #3cb371, #0d98ba); text-align: center; color: #000;">
                <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
                    <p>Thank you for being part of the Chasing Nostalgia community!</p>
                    <p style="margin: 0;">- John & Brittney</p>
                </div>
                <img src="https://drive.google.com/uc?export=view&id=1KxslqPX0kJlDcNfxc00iz74YoD97wwz7" alt="Mascot Image" style="margin-top: 10px; width: auto; height: 80px; object-fit: contain;">
                <div style="margin-top: 20px; display: flex; justify-content: center; align-items: center;">
                    <div style="margin-right: 15px;">
                        <img src="https://drive.google.com/uc?export=view&id=1hwU_YsX8tagMcnhBmjlapzHUUHiEvuT0" alt="Instagram" style="width: 20px; vertical-align: middle; margin-right: 8px;">
                        <a href="https://instagram.com/chasingnostalgia__" style="color: #6a0dad; text-decoration: none;">chasingnostalgia__</a>
                    </div>
                    <div>
                        <img src="https://drive.google.com/uc?export=view&id=1Ko1npYD0Ae7JA3Xq4he8A_oMy-77IvDp" alt="Website" style="width: 20px; vertical-align: middle; margin-right: 8px;">
                        <a href="https://www.google.com" style="color: #6a0dad; text-decoration: none;">Chasing Nostalgia</a>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    return { subject, text, html };
};

module.exports = {
    generateTicketPurchaseEmail,
};
