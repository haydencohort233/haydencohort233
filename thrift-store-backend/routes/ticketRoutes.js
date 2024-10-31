const express = require('express');
const ticketController = require('../controllers/ticketController');
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();
const { serverLogger } = require('../utils/logger');  // Correctly import serverLogger

// Route to fetch events with available tickets (only those with tickets enabled)
router.get('/events-with-tickets', async (req, res, next) => {
  try {
    serverLogger.info('Fetching events with available tickets...');
    await ticketController.getEventsWithTickets(req, res, next);
    serverLogger.info('Successfully fetched events with available tickets.');
  } catch (error) {
    serverLogger.error(`Error fetching events with tickets: ${error.message}`);
    next(error); // Pass error to error-handling middleware
  }
});

// Route to check the availability of tickets for specific events or ticket types
router.get('/availability', async (req, res, next) => {
  try {
    serverLogger.info('Checking availability of tickets...');
    await ticketController.checkAvailability(req, res, next);
    serverLogger.info('Successfully checked ticket availability.');
  } catch (error) {
    serverLogger.error(`Error checking ticket availability: ${error.message}`);
    next(error); // Pass error to error-handling middleware
  }
});

// Route to handle ticket purchases
router.post('/buy', async (req, res, next) => {
  try {
    serverLogger.info('Processing ticket purchase...');
    await purchaseController.buyTicket(req, res, next);
    serverLogger.info('Ticket purchase successful.');
  } catch (error) {
    serverLogger.error(`Error processing ticket purchase: ${error.message}`);
    next(error); // Pass error to error-handling middleware
  }
});

// Route to fetch all tickets (admin or user interface purpose)
router.get('/', async (req, res, next) => {
  try {
    serverLogger.info('Fetching all tickets...');
    await ticketController.getAllTickets(req, res, next);
    serverLogger.info('Successfully fetched all tickets.');
  } catch (error) {
    serverLogger.error(`Error fetching all tickets: ${error.message}`);
    next(error); // Pass error to error-handling middleware
  }
});

// Route to add a new ticket
router.post('/', async (req, res, next) => {
  try {
    serverLogger.info('Adding a new ticket...');
    await ticketController.addTicket(req, res, next);
    serverLogger.info('Successfully added new ticket.');
  } catch (error) {
    serverLogger.error(`Error adding new ticket: ${error.message}`);
    next(error); // Pass error to error-handling middleware
  }
});

// Route to fetch tickets by event ID
router.get('/events/:eventId/tickets', async (req, res, next) => {
  try {
    const { eventId } = req.params;
    serverLogger.info(`Fetching tickets for event ID: ${eventId}...`);
    await ticketController.getTicketsByEventId(req, res, next);
    serverLogger.info(`Successfully fetched tickets for event ID: ${eventId}.`);
  } catch (error) {
    serverLogger.error(`Error fetching tickets for event ID ${req.params.eventId}: ${error.message}`);
    next(error); // Pass error to error-handling middleware
  }
});

// Dynamic route to fetch a specific ticket by its ID
router.get('/:ticketId', async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    serverLogger.info(`Fetching ticket with ID: ${ticketId}...`);
    await ticketController.getTicket(req, res, next);
    serverLogger.info(`Successfully fetched ticket with ID: ${ticketId}.`);
  } catch (error) {
    serverLogger.error(`Error fetching ticket with ID ${req.params.ticketId}: ${error.message}`);
    next(error); // Pass error to error-handling middleware
  }
});

// Route to update a ticket by ID
router.put('/:ticketId', async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    serverLogger.info(`Updating ticket with ID: ${ticketId}...`);
    await ticketController.updateTicket(req, res, next);
    serverLogger.info(`Successfully updated ticket with ID: ${ticketId}.`);
  } catch (error) {
    serverLogger.error(`Error updating ticket with ID ${ticketId}: ${error.message}`);
    next(error); // Pass error to error-handling middleware
  }
});

// Route to fetch a specific ticket of an event by event ID and ticket ID
router.get('/events/:eventId/tickets/:ticketId', async (req, res, next) => {
  try {
    const { eventId, ticketId } = req.params;
    serverLogger.info(`Fetching ticket with ID: ${ticketId} for event ID: ${eventId}...`);
    await ticketController.getTicketByEventAndTicketId(req, res, next);
    serverLogger.info(`Successfully fetched ticket with ID: ${ticketId} for event ID: ${eventId}.`);
  } catch (error) {
    serverLogger.error(`Error fetching ticket with ID ${req.params.ticketId} for event ID ${req.params.eventId}: ${error.message}`);
    next(error); // Pass error to error-handling middleware
  }
});

router.delete('/:ticketId', ticketController.deleteTicket);

module.exports = router;
