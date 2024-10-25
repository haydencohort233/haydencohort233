const winston = require('winston');
const { db, query } = require('../config/db');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
      new winston.transports.Console(),
    ],
  });

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

exports.getTicket = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const ticket = await query('SELECT * FROM event_ticket_types WHERE id = ?', [ticketId]);

        if (!ticket || ticket.length === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.status(200).json({ ticket: ticket[0], message: 'Ticket fetched successfully' });
    } catch (error) {
        console.error('Error fetching ticket:', error.message);
        res.status(500).json({ message: 'Error fetching ticket', error: error.message });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await query('SELECT * FROM event_ticket_types');

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found' });
        }

        res.status(200).json({ tickets, message: 'All tickets fetched successfully' });
    } catch (error) {
        console.error('Error fetching tickets:', error.message);
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};

exports.getTicketsByEventId = async (req, res) => {
    const { eventId } = req.params;
    try {
        const tickets = await query(
            'SELECT id AS ticketTypeId, ticket_type AS ticketType, ticket_description AS ticketDescription, price, available_tickets AS availableTickets FROM event_ticket_types WHERE event_id = ? AND available_tickets > 0',
            [eventId]
        );
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found for the specified event' });
        }
        res.status(200).json({ tickets });  // Return the array of tickets as "tickets"
    } catch (error) {
        console.error('Error fetching tickets by event ID:', error.message);
        res.status(500).json({ message: 'Error fetching tickets', error: error.message });
    }
};

exports.getTicketByEventAndTicketId = async (req, res) => {
    const { eventId, ticketId } = req.params;
  
    try {
      const ticket = await query(
        'SELECT * FROM event_ticket_types WHERE event_id = ? AND id = ?', 
        [eventId, ticketId]
      );
  
      if (!ticket || ticket.length === 0) {
        return res.status(404).json({ message: 'Ticket not found for the specified event' });
      }
  
      res.status(200).json({ ticket: ticket[0], message: 'Ticket fetched successfully' });
    } catch (error) {
      console.error('Error fetching ticket:', error.message);
      res.status(500).json({ message: 'Error fetching ticket', error: error.message });
    }
  };

  exports.deleteTicket = (req, res) => {
    const ticketId = req.params.id;
    const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';
  
    // Query to get the ticket information
    const getTicketQuery = 'SELECT ticket_type FROM event_ticket_types WHERE id = ?';
    db.query(getTicketQuery, [ticketId], (err, ticketResults) => {
      if (err || ticketResults.length === 0) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
  
      const ticketType = ticketResults[0].ticket_type;
      const deleteQuery = 'DELETE FROM event_ticket_types WHERE id = ?';
      db.query(deleteQuery, [ticketId], (err, deleteResults) => {
        if (err) {
          logger.error('Error deleting ticket:', err);
          return res.status(500).json({ error: 'Failed to delete ticket' });
        }
  
        if (deleteResults.affectedRows === 0) {
          return res.status(404).json({ error: 'Ticket not found' });
        }
  
        logAction('Ticket Deleted', ticketType, ticketId, adminUsername);
        res.json({ message: `Ticket ${ticketType} (ID: ${ticketId}) deleted successfully` });
      });
    });
  };
  
  // Helper function to log actions (placeholder)
  const logAction = (action, itemType, itemId, adminUsername) => {
    logger.info(`${action} - ${itemType} (ID: ${itemId}) by ${adminUsername}`);
  };  
