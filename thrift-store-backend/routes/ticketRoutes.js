const express = require('express');
const ticketController = require('../controllers/ticketController');
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();

// Route to fetch events with available tickets and sold-out ones
router.get('/events-with-tickets', ticketController.getEventsWithTickets);

// Route to check ticket availability
router.get('/availability', ticketController.checkAvailability);  // Move this route before the dynamic route

// Other ticket-related routes
router.post('/buy', purchaseController.buyTicket);

// Fetch all tickets
router.get('/', ticketController.getAllTickets);

// Dynamic route to fetch a specific ticket by ID
router.get('/:ticketId', ticketController.getTicket);  // This must come after all specific routes

module.exports = router;
