const db = require('../config/db');
const { logAction } = require('../controllers/logsController');

// Fetch the next 3 upcoming events
exports.getUpcomingEvents = (req, res) => {
  const query = `
    SELECT id, title, date, time, description, preview_text, photo_url, title_photo, tickets_enabled
    FROM chasingevents 
    WHERE date >= CURDATE() 
    ORDER BY date ASC, time ASC 
    LIMIT 3`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching upcoming events:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

exports.getAllEvents = (req, res) => {
  const query = `
    SELECT id, title, date, time, description, preview_text, photo_url, title_photo, tickets_enabled
    FROM chasingevents
    ORDER BY date ASC, time ASC`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

exports.addEvent = (req, res) => {
  const { title, date, time, description, preview_text, tickets_enabled = 0 } = req.body; // Add tickets_enabled with default value
  const photoUrl = req.files['photo'] ? `/uploads/events/${req.files['photo'][0].filename}` : null;
  const titlePhoto = req.files['title_photo'] ? `/uploads/events/${req.files['title_photo'][0].filename}` : null;

  const query = `
    INSERT INTO chasingevents (title, date, time, description, preview_text, photo_url, title_photo, tickets_enabled) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [title, date, time, description, preview_text, photoUrl, titlePhoto, tickets_enabled];

  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding event:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    logAction('Event Added', title, results.insertId, adminUsername);

    res.status(201).json({ message: 'Event added successfully', id: results.insertId });
  });
};

exports.updateEvent = (req, res) => {
  const { id } = req.params;
  const { name, description, date, time, preview_text, tickets_enabled = 0 } = req.body; // Include tickets_enabled

  const photoUrl = req.files && req.files['photo'] ? `/uploads/events/${req.files['photo'][0].filename}` : req.body.photo_url;
  const titlePhoto = req.files && req.files['title_photo'] ? `/uploads/events/${req.files['title_photo'][0].filename}` : req.body.title_photo;

  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  const query = `
    UPDATE chasingevents 
    SET title = ?, description = ?, date = ?, time = ?, preview_text = ?, title_photo = ?, photo_url = ?, tickets_enabled = ?
    WHERE id = ?`;

  const values = [name, description, date, time, preview_text, titlePhoto, photoUrl, tickets_enabled, id]; // Ensure order matches the query

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating event:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    logAction('Event Modified', name, id, adminUsername);

    res.json({ message: 'Event updated successfully' });
  });
};

exports.getEventById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id, title AS name, description, date, time, photo_url, preview_text, title_photo, tickets_enabled FROM chasingevents WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching event by ID:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(results[0]);
  });
};

exports.getEventsWithTicketsEnabled = (req, res) => {
  const query = `
    SELECT id, title, date, time, description, preview_text, photo_url, title_photo, tickets_enabled
    FROM chasingevents
    WHERE tickets_enabled = 1
    ORDER BY date ASC, time ASC`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events with tickets enabled:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};


exports.getEventTicketsById = (req, res) => {
  const { id } = req.params;
  console.log(`Fetching tickets for event with ID: ${id}`); // Debugging statement
  
  const query = `
    SELECT id, ticket_type, ticket_description, price, available_tickets
    FROM event_ticket_types
    WHERE event_id = ? AND available_tickets > 0`;

    console.log(`Fetching tickets for event with ID: ${id}`); // Log the event ID
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching tickets for event:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
    
        console.log('Query results:', results); // Log the actual results from the database
    
        if (results.length === 0) {
            console.log(`No tickets found for event with ID: ${id}`);
            return res.status(404).json({ message: 'No tickets found for the specified event' });
        }
    
        res.status(200).json(results);
    });    
};
