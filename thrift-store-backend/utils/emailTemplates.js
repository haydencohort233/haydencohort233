const generateTicketPurchaseEmail = ({
    firstName,
    lastName,
    eventName,
    tickets = [],
    confirmationCode,
    totalCost = 0,
}) => {
    const validTotalCost = typeof totalCost === 'number' && !isNaN(totalCost) ? totalCost : 0;

    // Generate the ticket details in HTML format
    const ticketDetailsHTML = tickets.map(ticket => {
        const ticketPrice = typeof ticket.price === 'number' && !isNaN(ticket.price) ? ticket.price : 0;
        const quantity = typeof ticket.quantity === 'number' && !isNaN(ticket.quantity) ? ticket.quantity : 1;

        return `
            <div style="background-color: #f3f3f3; border: 1px solid #cccccc; padding: 15px; margin: 15px 0; border-radius: 5px;">
                <p style="font-size: 1.2em; margin: 10px 0; color: #333; font-weight: bold;">
                    ${quantity} x <span style="color: #ff6f61;">${ticket.ticketType}</span> - 
                    <span style="color: #ff6f61;">$${ticketPrice.toFixed(2)}</span> each
                </p>
            </div>
        `;
    }).join('');

    // Generate the ticket details in plain text format
    const ticketDetailsText = tickets.map(ticket => {
        const ticketPrice = typeof ticket.price === 'number' && !isNaN(ticket.price) ? ticket.price : 0;
        const quantity = typeof ticket.quantity === 'number' && !isNaN(ticket.quantity) ? ticket.quantity : 1;

        return `${quantity} x ${ticket.ticketType} - $${ticketPrice.toFixed(2)} each`;
    }).join('\n');

    const subject = `Your tickets for ${eventName}`;
    const text = `Hi ${firstName} ${lastName},\n\nThank you for purchasing tickets to ${eventName}!\n\n${ticketDetailsText}\n\nTotal: $${validTotalCost.toFixed(2)}\n\nYour confirmation code is: ${confirmationCode}.\n\nPlease keep this code safe as it will help us verify your purchase if needed.\n\nWe appreciate your support and look forward to seeing you at the event.\n\n- Chasing Nostalgia, John & Brittney`;

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
                <p>Thank you for purchasing tickets to <strong>${eventName}</strong>!</p>
                
                <!-- Ticket Details -->
                ${ticketDetailsHTML}

                <p style="font-size: 1.2em; margin: 10px 0; color: #333; font-weight: bold;">Total Cost: <span style="color: #ff6f61;">$${validTotalCost.toFixed(2)}</span></p>
                <p style="font-size: 1.2em; margin: 10px 0; color: #333; font-weight: bold;">Your Confirmation Code Is: <span style="color: #ff6f61;">${confirmationCode}</span></p>

                <p>Please keep this code safe as it will help us verify your purchase if needed.</p>
            </div>

            <!-- Footer with distinct background color -->
            <div style="padding: 20px; background: linear-gradient(to right, #3cb371, #0d98ba); text-align: center; color: #000;">
                <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
                    <p>Thank you for being part of the Chasing Nostalgia community!</p>
                    <p style="margin: 0;">- John & Brittney</p>
                </div>
                <img src="https://drive.google.com/uc?export=view&id=1KxslqPX0kJlDcNfxc00iz74YoD97wwz7" alt="Mascot Image" style="margin-top: 10px; width: auto; height: 80px; object-fit: contain;">
            </div>
        </div>
    </div>`;

    return { subject, text, html };
};

module.exports = { generateTicketPurchaseEmail };
