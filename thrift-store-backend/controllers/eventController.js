const db = require('../config/db');

exports.getUpcomingEvents = (req, res) => {
  const query = 'SELECT * FROM chasingevents WHERE date >= CURDATE() ORDER BY date ASC LIMIT 3';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

exports.addEvent = (req, res) => {
  const { title, date, time, description } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const query = 'INSERT INTO chasingevents (title, date, time, description, photo_url) VALUES (?, ?, ?, ?, ?)';
  const values = [title, date, time, description, photoUrl];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding event:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.status(201).json({ message: 'Event added successfully', id: results.insertId });
  });
};
