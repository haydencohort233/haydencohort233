const db = require('../config/db');
const { logAction } = require('../utils/logHelper');

// Fetch the next 3 upcoming events
exports.getUpcomingEvents = (req, res) => {
  const query = `
    SELECT id, title, date, time, description, preview_text, photo_url, title_photo 
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
    SELECT id, title AS name, date, time, description
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
  const { title, date, time, description, preview_text } = req.body;
  const photoUrl = req.file ? `/uploads/events/${req.file.filename}` : null;
  const titlePhoto = req.file ? `/uploads/events/${req.file.filename}` : null;

  const query = `
    INSERT INTO chasingevents (title, date, time, description, preview_text, photo_url, title_photo) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [title, date, time, description, preview_text, photoUrl, titlePhoto];
  
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
  const { name, description, date } = req.body;
  
  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  const query = 'UPDATE chasingevents SET title = ?, description = ?, date = ? WHERE id = ?';
  const values = [name, description, date, id];

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
  const query = 'SELECT id, title AS name, description, date, time FROM chasingevents WHERE id = ?';
  
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
