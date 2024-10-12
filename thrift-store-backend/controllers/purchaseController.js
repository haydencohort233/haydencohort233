const sendConfirmationEmail = require('../utils/emailService');
const { generateTicketPurchaseEmail } = require('../utils/emailTemplates');
const generateConfirmationCode = require('../utils/emailConfirmCode');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db } = require('../config/db');

// Modified buyTicket function with support for ticket types
exports.buyTicket = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, eventId, quantity, paymentMethodId, discountCode, ticketTypeId } = req.body;

    try {
        // Fetch the ticket type details, including the price and available tickets
        const ticketTypeQueryResult = await new Promise((resolve, reject) => {
            db.query(
                'SELECT price, available_tickets, ticket_type FROM event_ticket_types WHERE id = ? AND event_id = ?',
                [ticketTypeId, eventId],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });

        const ticketType = ticketTypeQueryResult[0]; // Ensure we are accessing the first row properly

        // Check if the ticket type exists and has enough tickets available
        if (!ticketType || ticketType.available_tickets < quantity) {
            console.log('Not enough tickets available for the selected ticket type');
            return res.status(400).json({ message: 'Not enough tickets available for the selected ticket type' });
        }

        const ticketPrice = parseFloat(ticketType.price) || 0; // Ensure ticketPrice is a valid number
        const ticketTypeName = ticketType.ticket_type;

        // Initialize discount variables
        let discountAmount = 0;
        let discountCodeId = null;

        // Validate discount code if provided
        if (discountCode) {
            const discountQueryResult = await new Promise((resolve, reject) => {
                db.query(
                    'SELECT * FROM discount_codes WHERE code = ? AND is_active = true AND (expires_at IS NULL OR expires_at > NOW())',
                    [discountCode],
                    (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    }
                );
            });

            const discount = discountQueryResult[0]; // Ensure we are accessing the first row properly

            if (discount) {
                discountAmount = discount.discount_percentage * 0.01 * (ticketPrice * quantity);
                discountCodeId = discount.id;
                console.log(`Discount applied: ${discount.discount_percentage}%`);
            } else {
                console.log('Invalid or expired discount code');
                return res.status(400).json({ message: 'Invalid or expired discount code.' });
            }
        }

        let confirmationCode = generateConfirmationCode();
        let isUnique = false;

        // Ensure that the confirmation code is unique in the database
        while (!isUnique) {
            const confirmationCodeQueryResult = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM ticket_purchases WHERE confirmation_code = ?', [confirmationCode], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });

            if (confirmationCodeQueryResult.length === 0) {
                isUnique = true; // Code is unique, exit the loop
            } else {
                confirmationCode = generateConfirmationCode(); // Generate a new code if there's a conflict
            }
        }

        // Calculate the final amount to be charged after applying the discount
        const amountToCharge = (ticketPrice * quantity) - discountAmount;

        // Process payment with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amountToCharge * 100), // Stripe requires the amount in cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            return_url: 'http://localhost:3000/payment-complete'
        });

        const totalPaid = paymentIntent.amount / 100; // Total paid (Stripe amounts are in cents)

        // Update available tickets for the specific ticket type in the database
        const newTicketCount = ticketType.available_tickets - quantity;
        await db.query('UPDATE event_ticket_types SET available_tickets = ? WHERE id = ?', [newTicketCount, ticketTypeId]);

        // Initialize emailSent variable before using it
        let emailSent = false;

        // Send confirmation email
        try {
            const { subject, text, html } = generateTicketPurchaseEmail(firstName, lastName, ticketTypeName, quantity, confirmationCode, ticketTypeName, ticketPrice);
            await sendConfirmationEmail(email, subject, text, html);
            emailSent = true;
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError.message);
        }

        // Insert purchase information into the `ticket_purchases` table and get the inserted ticket ID
        const purchaseInsertResult = await new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ticket_purchases 
                (first_name, last_name, email, phone_number, event_id, event_name, quantity, total_paid, confirm_email, confirmation_code) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [firstName, lastName, email, phoneNumber, eventId, ticketTypeName, quantity, totalPaid, emailSent, confirmationCode],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });

        const ticketPurchaseId = purchaseInsertResult.insertId; // Get the ticket purchase ID

        // Track discount code usage if applicable
        if (discountCodeId) {
            await db.query(
                'INSERT INTO discount_code_usages (discount_code_id, ticket_purchase_id, user_email, used_at) VALUES (?, ?, ?, NOW())',
                [discountCodeId, ticketPurchaseId, email]
            );
            console.log('Discount code usage recorded successfully.');
        }

        // Respond to client
        res.status(200).json({ message: 'Purchase successful', paymentIntent, confirmationCode });
    } catch (error) {
        console.error('Error processing ticket purchase:', error.message);
        return res.status(500).json({ message: 'Purchase failed', error: error.message });
    }
};
