const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db, query } = require('../config/db');

exports.getEventsWithTickets = async (req, res) => {
    try {
        // Wrap db.query in a Promise
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

        // Fetch events that have tickets enabled
        const events = await queryPromise(
            'SELECT id, title, date, time, description, preview_text, title_photo, photo_url FROM chasingevents WHERE tickets_enabled = true'
        );


        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events with tickets enabled found' });
        }

        // Fetch ticket types for each event
        for (const event of events) {
            const ticketTypes = await queryPromise(
                'SELECT id, ticket_type, ticket_description, price, available_tickets FROM event_ticket_types WHERE event_id = ? AND available_tickets > 0',
                [event.id]
            );
            event.ticketTypes = ticketTypes;
        }

        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events with tickets:', error.message);
        res.status(500).json({ message: `Error fetching events: ${error.message}` });
    }
};

exports.checkAvailability = async (req, res) => {
    const { eventId, ticketTypeId } = req.query;

    console.log(`Checking availability for event ID: ${eventId}, Ticket Type ID: ${ticketTypeId}`);

    try {
        let availabilityQuery;
        let queryParams;

        // If a ticket type ID is provided, check availability at the ticket type level
        if (ticketTypeId) {
            availabilityQuery = 'SELECT ticket_type, price, available_tickets FROM event_ticket_types WHERE id = ?';
            queryParams = [ticketTypeId];
        } else {
            // If only an event ID is provided, check availability at the event level
            availabilityQuery = 'SELECT title, tickets_enabled FROM chasingevents WHERE id = ?';
            queryParams = [eventId];
        }

        const rows = await query(availabilityQuery, queryParams);

        console.log('Rows:', rows);

        // If no rows are returned, return a 404
        if (!rows || rows.length === 0) {
            console.log(`No event or ticket type found for the provided ID`);
            return res.status(404).json({ message: 'Event or ticket type not found' });
        }

        // Return the event or ticket type name and tickets status
        res.status(200).json({ ticketsEnabled: rows[0].tickets_enabled, details: rows[0] });
    } catch (error) {
        console.error('Error checking ticket availability:', error.message);
        res.status(500).json({ message: 'Error checking ticket availability', error: error.message });
    }
};

// Get a specific ticket (placeholder)
exports.getTicket = (req, res) => {
    const { ticketId } = req.params;
    res.status(200).json({ ticketId, message: 'Ticket fetched successfully' });
};

// Get all tickets (placeholder)
exports.getAllTickets = (req, res) => {
    res.status(200).json({ message: 'All tickets fetched successfully' });
};

exports.getTicketsByEventId = async (req, res) => {
    const { eventId } = req.params;
    try {
        const tickets = await query(
            'SELECT id, ticket_type, ticket_description, price, available_tickets FROM event_ticket_types WHERE event_id = ? AND available_tickets > 0',
            [eventId]
        );
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found for the specified event' });
        }
        res.status(200).json(tickets);  // Return the array of tickets
    } catch (error) {
        console.error('Error fetching tickets by event ID:', error.message);
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};
