const sendConfirmationEmail = require('../utils/emailService');
const { generateTicketPurchaseEmail } = require('../utils/emailTemplates'); // Import the email template function
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db } = require('../config/db');

// Developer method to send a test email
exports.sendTestEmail = async (req, res) => {
    try {
        const testEmail = 'Haydencjanes@gmail.com';
        const firstName = 'John';
        const lastName = 'Doe';
        const eventName = 'Test Event';
        const quantity = 1;

        const { subject, text, html } = generateTicketPurchaseEmail(firstName, lastName, eventName, quantity);

        await sendConfirmationEmail(testEmail, subject, text, html);

        res.status(200).json({ message: 'Test email sent successfully!' });
    } catch (error) {
        console.error('Error sending test email:', error.message);
        res.status(500).json({ message: 'Failed to send test email', error: error.message });
    }
};

exports.buyTicket = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, eventId, quantity, paymentMethodId } = req.body;

    try {
        // Fetch the event details from the database, including the title and available tickets
        const [event] = await new Promise((resolve, reject) => {
            db.query('SELECT tickets, title FROM chasingevents WHERE id = ?', [eventId], (err, results) => {
                if (err) {
                    reject(err); // If there's an error with the query, reject the promise
                } else {
                    resolve(results); // Resolve with the query results, which should include the event title
                }
            });
        });

        // Check if the event exists and has tickets available
        if (!event || event.tickets === null || event.tickets === 0) {
            console.log('No tickets available for this event');
            return res.status(400).json({ message: 'No tickets available for this event' });
        }

        if (quantity > event.tickets) {
            console.log('Not enough tickets available');
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        const eventName = event.title; // Correctly set the event name from the database result

        // Process payment with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000 * quantity,  // Assuming $10 per ticket
            currency: 'usd',
            payment_method: paymentMethodId, // Use the payment method ID from the request
            confirm: true, // Immediately confirm the payment
            return_url: 'http://localhost:3000/payment-complete'  // Replace with your frontend URL for completion
        });

        const totalPaid = paymentIntent.amount / 100;  // Total paid (Stripe amounts are in cents)

        // Update available tickets in the database
        const newTicketCount = event.tickets - quantity;
        await db.query('UPDATE chasingevents SET tickets = ? WHERE id = ?', [newTicketCount, eventId]);

        // Send confirmation email
        let emailSent = false;
        try {
            const { subject, text, html } = generateTicketPurchaseEmail(firstName, lastName, eventName, quantity); // Use the new email template
            await sendConfirmationEmail(email, subject, text, html);
            emailSent = true;
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError.message);
        }

        // Insert purchase information into the `ticket_purchases` table
        await db.query(
            `INSERT INTO ticket_purchases 
                (first_name, last_name, email, phone_number, event_id, event_name, quantity, total_paid, confirm_email) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, phoneNumber, eventId, eventName, quantity, totalPaid, emailSent]
        );

        // Respond to client
        res.status(200).json({ message: 'Purchase successful', paymentIntent });
    } catch (error) {
        console.error('Error processing ticket purchase:', error.message);
        return res.status(500).json({ message: 'Purchase failed', error: error.message });
    }
};
