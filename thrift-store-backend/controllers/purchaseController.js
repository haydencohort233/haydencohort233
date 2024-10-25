const sendConfirmationEmail = require('../utils/emailService');
const { generateTicketPurchaseEmail } = require('../utils/emailTemplates');
const generateConfirmationCode = require('../utils/emailConfirmCode');
const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid'); // For generating idempotency keys
const { Client, Environment } = require('square');
const { promisify } = require('util');
const logger = require('../utils/logger'); // Import Winston logger
require('dotenv').config();

// Initialize Square client
const client = new Client({
    accessToken: process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
    environment: Environment.Sandbox, // Use Sandbox for testing
});

const { paymentsApi } = client;
const query = promisify(db.query).bind(db);

exports.buyTicket = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, eventId, selectedTickets, sourceId, discountCode } = req.body;

    logger.info('Received buyTicket request:', req.body);

    // Start a database transaction
    await query('START TRANSACTION');

    try {
        let totalCost = 0;
        let firstTicketPrice = 0; // Store the first ticket price for email

        // Loop through each selected ticket and process it
        for (const selectedTicket of selectedTickets) {
            const { ticketTypeId, quantity } = selectedTicket; // Update to use ticketTypeId

            logger.info(`Processing ticketTypeId: ${ticketTypeId}, quantity: ${quantity}`);

            // Fetch ticket details from the event_ticket_types table
const ticketTypeQueryResult = await query(
    'SELECT id, ticket_type, price FROM event_ticket_types WHERE id = ?',
    [selectedTickets[0].eventTickets[0].ticketTypeId] // Ensure ticketTypeId is passed correctly
  );
  const ticketResult = ticketTypeQueryResult[0];  // Get the first result
  
  if (!ticketResult) {
    logger.error('Ticket type not found for ticketTypeId:', selectedTickets[0].eventTickets[0].ticketTypeId);
    return res.status(404).json({ message: 'Ticket type not found' });
  }
  
  const ticketType = ticketResult.ticket_type;  // Ensure this contains the ticket_type field  

            // Log current available tickets before update
            const currentTickets = ticketTypeData.available_tickets;
            logger.info(`Current available tickets for ticketTypeId: ${ticketTypeId}: ${currentTickets}`);

            if (ticketTypeData.available_tickets < quantity) {
                logger.warn(`Not enough tickets available for ticketTypeId: ${ticketTypeId}. Requested: ${quantity}, Available: ${ticketTypeData.available_tickets}`);
                await query('ROLLBACK');
                return res.status(400).json({ message: 'Not enough tickets available for the selected ticket type' });
            }

            // Calculate total cost
            const ticketPrice = parseFloat(ticketTypeData.price) || 0;  // Ensure it's a valid number
            totalCost += ticketPrice * quantity;

            if (firstTicketPrice === 0) {
                firstTicketPrice = ticketPrice; // Store the first ticket price for the email
            }

            // Update the available_tickets in event_ticket_types table
            logger.info(`Updating available tickets for ticketTypeId: ${ticketTypeId}, reducing by quantity: ${quantity}`);
            const updateResult = await query(
                `UPDATE event_ticket_types 
                SET available_tickets = available_tickets - ? 
                WHERE id = ? AND event_id = ? AND available_tickets >= ?`,
                [quantity, ticketTypeId, eventId, quantity]
            );

            if (updateResult.affectedRows === 0) {
                logger.error(`Failed to update available tickets for ticketTypeId: ${ticketTypeId}`);
                await query('ROLLBACK');
                return res.status(400).json({ message: 'Failed to update available tickets' });
            }

            // Fetch the updated available tickets
            const updatedTicketTypeQueryResult = await query(
                'SELECT available_tickets FROM event_ticket_types WHERE id = ? AND event_id = ?',
                [ticketTypeId, eventId]
            );
            const updatedTickets = updatedTicketTypeQueryResult[0].available_tickets;
            logger.info(`Updated available tickets for ticketTypeId: ${ticketTypeId}: ${updatedTickets}`);
        }

        logger.info(`Total cost for all tickets: $${totalCost}`);

        // Process payment with Square
        logger.info('Processing payment with Square...');
        const idempotencyKey = uuidv4();
        const totalAmountInCents = Math.round(totalCost * 100);  // Convert total cost to cents
        const paymentResponse = await paymentsApi.createPayment({
            sourceId,
            idempotencyKey,
            amountMoney: {
                amount: totalAmountInCents,
                currency: 'USD',
            },
            autocomplete: true,
        });

        if (!paymentResponse.result || paymentResponse.result.payment.status !== 'COMPLETED') {
            logger.error('Payment failed with Square.');
            await query('ROLLBACK');
            return res.status(400).json({ message: 'Payment failed' });
        }

        logger.info('Payment successful:', paymentResponse.result);
        const payment = paymentResponse.result.payment;
        const confirmationCode = generateConfirmationCode();

        // Insert purchase record into shop_purchases
        logger.info('Inserting purchase record into shop_purchases...');
        const insertPurchaseQuery = `
            INSERT INTO shop_purchases 
            (first_name, last_name, email, phone_number, event_id, quantity, total_amount, confirmation_code, discount_code) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [purchaseResult] = await query(insertPurchaseQuery, [
            firstName, lastName, email, phoneNumber, eventId, 
            selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0), 
            totalCost, confirmationCode, discountCode || null
        ]);

        const purchaseId = purchaseResult.insertId;

        // Insert each ticket into ticket_sales with the purchase ID
        for (const selectedTicket of selectedTickets) {
            const { ticketTypeId, quantity } = selectedTicket; // Use ticketTypeId
            const ticketPrice = parseFloat(ticketTypeData.price) * quantity;  // Ensure price is correctly formatted

            await query(
                `INSERT INTO ticket_sales (event_id, ticket_type_id, purchaser_email, purchaser_first_name, purchaser_last_name, phone_number, quantity, total_price, purchase_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [eventId, ticketTypeId, email, firstName, lastName, phoneNumber, quantity, ticketPrice, purchaseId]
            );
        }

        // Commit the transaction
        await query('COMMIT');
        logger.info('Transaction committed successfully.');

        // Send confirmation email
        try {
            const ticketTypeName = selectedTickets[0].ticketType.ticket_type; // Ensure you access `ticket_type` correctly
            await sendConfirmationEmail({
                to: email,
                subject: 'Your Ticket Purchase Confirmation',
                html: generateTicketPurchaseEmail({
                    firstName,
                    lastName,
                    eventName: selectedTickets[0].event.name, // Ensure correct event name
                    quantity: selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
                    confirmationCode,
                    ticket_type: ticketTypeName,  // Pass the ticket type name
                    ticketPrice: firstTicketPrice.toFixed(2),  // Ensure ticketPrice is passed correctly
                    totalCost: totalCost.toFixed(2),  // Pass the total cost correctly
                }).html,
            });            
            logger.info(`Confirmation email sent to ${email}`);
        } catch (emailError) {
            logger.error(`Failed to send confirmation email to ${email}: ${emailError.message}`);
        }

        // Respond to frontend
        res.status(200).json({
            message: 'Purchase successful',
            totalCost,
            paymentId: payment.id,
            result: paymentResponse.result,
        });

    } catch (error) {
        await query('ROLLBACK');
        logger.error('Error during ticket purchase:', error.message);
        res.status(500).json({ message: 'Purchase failed', error: error.message });
    }
};
