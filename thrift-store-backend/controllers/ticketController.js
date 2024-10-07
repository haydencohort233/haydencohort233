const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db, query } = require('../config/db');

// Fetch all events, including sold-out events but excluding ones without tickets
exports.getEventsWithTickets = async (req, res) => {
    try {
        // Using the db.query wrapped in a Promise
        const queryPromise = (sql, params) => {
            return new Promise((resolve, reject) => {
                db.query(sql, params, (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
        };

        // Fetch events from the database where tickets are greater than or equal to 0 (excluding NULL)
        const rows = await queryPromise(
            'SELECT id, title, date, time, description, preview_text, tickets FROM chasingevents WHERE tickets IS NOT NULL AND tickets >= 0'
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No events with tickets found' });
        }

        // Send the rows (events) back as JSON
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching events with tickets:', error.message);
        res.status(500).json({ message: `Error fetching events: ${error.message}` });
    }
};

// Check ticket availability
exports.checkAvailability = async (req, res) => {
    const { eventId } = req.query;

    console.log(`Checking availability for event ID: ${eventId}`);

    try {
        // Use the custom query function from db.js
        const rows = await query('SELECT title, tickets FROM chasingevents WHERE id = ?', [eventId]);

        console.log('Rows:', rows);

        // If no rows are returned, return a 404
        if (!rows || rows.length === 0) {
            console.log(`No event found for event ID: ${eventId}`);
            return res.status(404).json({ message: 'Event not found' });
        }

        const eventName = rows[0].title;
        const availableTickets = rows[0].tickets;

        console.log(`Event found: ${eventName}, Tickets available: ${availableTickets}`);

        // Return the event name and available tickets
        res.status(200).json({ eventName, availableTickets });
    } catch (error) {
        console.error('Error checking ticket availability:', error.message);
        res.status(500).json({ message: 'Error checking ticket availability', error: error.message });
    }
};

// Get a specific ticket
exports.getTicket = (req, res) => {
    const { ticketId } = req.params;
    res.status(200).json({ ticketId, message: 'Ticket fetched successfully' });
};

// Get all tickets
exports.getAllTickets = (req, res) => {
    res.status(200).json({ message: 'All tickets fetched successfully' });
};
