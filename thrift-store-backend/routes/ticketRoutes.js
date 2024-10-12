const express = require('express');
const ticketController = require('../controllers/ticketController');
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();

// Route to fetch events with available tickets (only those with tickets enabled)
router.get('/events-with-tickets', ticketController.getEventsWithTickets);

// Route to check the availability of tickets for specific events or ticket types
router.get('/availability', ticketController.checkAvailability);

// Route to handle ticket purchases
router.post('/buy', purchaseController.buyTicket);

// Route to fetch all tickets (admin or user interface purpose)
router.get('/', ticketController.getAllTickets);

// Route to fetch tickets by event ID
router.get('/events/:eventId/tickets', ticketController.getTicketsByEventId);

// Dynamic route to fetch a specific ticket by its ID
router.get('/:ticketId', ticketController.getTicket);

module.exports = router;
