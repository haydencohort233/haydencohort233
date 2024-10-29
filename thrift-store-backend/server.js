require('dotenv').config();
require('dotenv').config({ path: '.env.sensitive' });
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const { db, query } = require('./config/db');
const express = require('express');
const fs = require('fs');
const { vendorLogger, serverLogger, logRequest } = require('./utils/logger');
const { promisify } = require('util');
const { Client, Environment } = require('square');
const { v4: uuidv4 } = require('uuid');
const JSONbig = require('json-bigint');
const { sendConfirmationEmail } = require('./utils/emailService');
const { generateTicketPurchaseEmail } = require('./utils/emailTemplates');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate Limiting Middleware
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Admin-Username', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Serve images and videos with correct MIME types
app.get('/downloads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'downloads', req.params.filename);
  const fileExtension = path.extname(filePath).toLowerCase();

  let contentType = 'application/octet-stream';
  if (fileExtension === '.mp4') contentType = 'video/mp4';
  else if (fileExtension === '.jpg' || fileExtension === '.jpeg') contentType = 'image/jpeg';
  else if (fileExtension === '.png') contentType = 'image/png';

  fs.exists(filePath, (exists) => {
    if (exists) {
      res.setHeader('Content-Type', contentType);
      res.sendFile(filePath);
      serverLogger.info(`File sent: ${req.params.filename}`);
    } else {
      res.status(404).send('File not found');
      serverLogger.error(`File not found: ${req.params.filename}`);
    }
  });
});

// Initialize Square client
const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
});

// Set cookie options with secure flags
const cookieOptions = {
  httpOnly: true,
  secure: true, // Only send over HTTPS
  sameSite: 'strict', // Helps mitigate CSRF attacks
  maxAge: 24 * 60 * 60 * 1000 // 1 day
};

// Example route for setting a cookie securely
app.post('/set-cookie', (req, res) => {
  res.cookie('exampleCookie', 'exampleValue', cookieOptions);
  res.status(200).send('Cookie set securely');
});

// Helper functions for customer lookup
async function findCustomerByEmail(email) {
  try {
    const searchResponse = await client.customersApi.searchCustomers({
      query: {
        filter: {
          emailAddress: {
            exact: email,
          },
        },
      },
    });

    if (searchResponse.result.customers && searchResponse.result.customers.length > 0) {
      vendorLogger.info(`Customer found by email: ${email}`);
      return searchResponse.result.customers[0];
    } else {
      vendorLogger.warn(`No customer found with email: ${email}, creating new customer...`);
      return null;
    }
  } catch (error) {
    vendorLogger.error(`Error searching customer by email: ${email} - ${error.message}`);
    return null;
  }
}

app.post('/process-payment', async (req, res) => {
  console.log('Incoming request body:', req.body);

  let {
    nonce,
    amount,
    firstName,
    lastName,
    email,
    phoneNumber,
    selectedTickets,
    discountCode,
  } = req.body;

  try {
    // Check if selectedTickets is valid and contains data
    if (!selectedTickets || selectedTickets.length === 0) {
      serverLogger.error('No selected tickets provided');
      return res.status(400).json({ error: 'No selected tickets provided' });
    }

    serverLogger.info('Starting payment process for customer:', { email, firstName, lastName, phoneNumber });
    serverLogger.info('Selected tickets:', selectedTickets); // Log selected tickets for debugging

    let customerId;
    let purchaseId = null;
    let discountCodeId = null;

    // Find or create customer
    const existingCustomer = await findCustomerByEmail(email);
    if (existingCustomer) {
      customerId = existingCustomer.id;
      vendorLogger.info(`Existing customer found for email: ${email}`);
    } else {
      const createCustomerResponse = await client.customersApi.createCustomer({
        emailAddress: email,
        givenName: firstName,
        familyName: lastName,
        phoneNumber: phoneNumber,
      });
      customerId = createCustomerResponse.result.customer.id;
      vendorLogger.info(`New customer created with ID: ${customerId}`);
    }

    // Handle discount code logic
    let discountPercentage = 0;
    if (discountCode) {
      const discountQueryResult = await query('SELECT id, discount_percentage FROM discount_codes WHERE code = ?', [discountCode]);
      if (discountQueryResult.length > 0) {
        discountPercentage = discountQueryResult[0].discount_percentage;
        discountCodeId = discountQueryResult[0].id; // Capture discount_code_id
        serverLogger.info(`Discount applied: ${discountPercentage}%`);
      } else {
        serverLogger.warn(`Invalid discount code: ${discountCode}`);
        return res.status(400).json({ error: 'Invalid discount code' });
      }
    }

    // Loop through all selected tickets to validate and calculate the total amount
    let totalAmount = 0;
    const ticketDetails = [];

    for (const event of selectedTickets) {
      for (const ticket of event.eventTickets) {
        // Fetch ticket price and ticket_type from event_ticket_types table for each selected ticket
        const ticketTypeQueryResult = await query(
          'SELECT ticket_type, price FROM event_ticket_types WHERE id = ?',
          [ticket.ticketTypeId]
        );
        const ticketResult = ticketTypeQueryResult[0];

        if (!ticketResult) {
          serverLogger.error(`Ticket type not found for ticketTypeId: ${ticket.ticketTypeId}`);
          return res.status(404).json({ message: 'Ticket type not found' });
        }

        const ticketPrice = parseFloat(ticketResult.price);
        if (isNaN(ticketPrice)) {
          serverLogger.error(`Invalid ticket price for ticketTypeId: ${ticket.ticketTypeId}`);
          return res.status(500).json({ message: 'Invalid ticket price' });
        }

        const discountedPrice = ticketPrice * (1 - discountPercentage / 100);
        totalAmount += discountedPrice * ticket.quantity;

        ticketDetails.push({
          ticketType: ticketResult.ticket_type,
          price: discountedPrice.toFixed(2),
          quantity: ticket.quantity,
        });

        // Update available tickets
        const updateTicketQuantityQuery = `
          UPDATE event_ticket_types 
          SET available_tickets = available_tickets - ?
          WHERE id = ?
        `;
        await query(updateTicketQuantityQuery, [ticket.quantity, ticket.ticketTypeId]);
        serverLogger.info(`Updated available tickets for ticketTypeId: ${ticket.ticketTypeId}, Quantity: ${ticket.quantity}`);
      }
    }

    // Check if the total amounts match
    if (totalAmount !== amount / 100) {
      serverLogger.warn(`Amount mismatch! Frontend amount: ${amount / 100}, Backend calculated amount: ${totalAmount}`);
      return res.status(400).json({ message: 'Amount mismatch, please try again' });
    }

    // Process payment with Square
    const idempotencyKey = uuidv4();
    const paymentResponse = await client.paymentsApi.createPayment({
      sourceId: nonce,
      idempotencyKey,
      amountMoney: {
        amount: Math.round(totalAmount * 100),  // Ensure amount is in cents
        currency: 'USD',
      },
      autocomplete: true,
      customerId,
    });

    if (paymentResponse.result.payment.status === 'COMPLETED') {
      const payment = paymentResponse.result.payment;
      serverLogger.info(`Payment successful for amount: ${totalAmount} USD`);

      const insertPurchaseQuery = `
        INSERT INTO shop_purchases
        (first_name, last_name, email, phone_number, event_id, quantity, total_amount, confirmation_code, payment_id, success_email, discount_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        firstName,
        lastName,
        email,
        phoneNumber,
        selectedTickets[0].event.id,
        selectedTickets[0].eventTickets[0].quantity,
        totalAmount,
        idempotencyKey,
        payment.id,
        0,
        discountCode || null,
      ];

      const result = await query(insertPurchaseQuery, params);
      purchaseId = result.insertId;
      serverLogger.info(`Purchase record inserted with ID: ${purchaseId}`);

      if (discountCodeId) {
        const insertDiscountUsageQuery = `
          INSERT INTO discount_code_usages (discount_code_id, ticket_purchase_id, user_email, used_at)
          VALUES (?, ?, ?, NOW())
        `;
        await query(insertDiscountUsageQuery, [discountCodeId, purchaseId, email]);
        serverLogger.info(`Discount code usage tracked for discountCodeId: ${discountCodeId}`);
      }

      // Send confirmation email
      const totalCostFormatted = totalAmount.toFixed(2);
      let emailSent = false;

      try {
        await sendConfirmationEmail({
          to: email,
          subject: `Your tickets for ${selectedTickets[0].event.title}`,
          text: `Hi ${firstName} ${lastName},\n\nThank you for purchasing tickets to ${selectedTickets[0].event.title}!\n\nYour confirmation code is: ${idempotencyKey}.\nTotal: $${totalCostFormatted}`,
          html: generateTicketPurchaseEmail({
            firstName,
            lastName,
            eventName: selectedTickets[0].event.title,
            tickets: ticketDetails,
            confirmationCode: idempotencyKey,
            totalCost: totalAmount,
          }).html,
        });

        serverLogger.info(`Confirmation email sent to: ${email}`);
        emailSent = true;
      } catch (emailError) {
        serverLogger.error(`Error sending confirmation email: ${emailError.message}`);
        emailSent = false;
      }

      // Update success_email to 1 (true) if the email was sent successfully
      const updateEmailStatusQuery = `
        UPDATE shop_purchases
        SET success_email = ?
        WHERE id = ?
      `;
      await query(updateEmailStatusQuery, [emailSent ? 1 : 0, purchaseId]);

      // Redirect to the payment-complete page on success
      return res.status(200).json({ message: 'Payment and email successful.', purchaseComplete: true });
    } else {
      serverLogger.error('Payment failed:', paymentResponse.result.errors);
      return res.status(400).json({ error: 'Payment failed.' });
    }
  } catch (error) {
    serverLogger.error(`Error processing payment: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Register the request logger middleware
app.use(logRequest);

const logRoutes = require('./routes/logRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const blogRoutes = require('./routes/blogRoutes');
const eventRoutes = require('./routes/eventRoutes');
const guestRoutes = require('./routes/guestRoutes');
const statusRoutes = require('./routes/statusRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const loginRoutes = require('./routes/loginRoutes');
const instagramRoutes = require('./routes/instagramRoutes');
const discountRoutes = require('./routes/discountRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api', vendorRoutes);
app.use('/api', eventRoutes);
app.use('/api', blogRoutes);
app.use('/api', guestRoutes);
app.use('/api', statusRoutes);
app.use('/api', notificationRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/discounts', discountRoutes);

// Error handling middleware with logging
app.use((err, req, res, next) => {
  serverLogger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Serve privacy policy
app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  serverLogger.info(`Server running on http://localhost:${PORT}`);
});
