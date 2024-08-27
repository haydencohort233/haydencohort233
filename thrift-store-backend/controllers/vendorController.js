const db = require('../config/db');
const path = require('path');

exports.getAllVendors = (req, res) => {
  const query = 'SELECT id, name, description, location, category, avatar FROM vendorshops';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching vendor data:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

exports.getFeaturedVendors = (req, res) => {
  const { ids } = req.query; // Optional: Use specific vendor IDs for manual selection

  let query = 'SELECT id, name, description, location, category, avatar FROM vendorshops';
  
  if (ids) {
    const idArray = ids.split(',').map(id => parseInt(id, 10)); // Convert IDs to integers
    query += ' WHERE id IN (?)'; // Use parameterized query
    db.query(query, [idArray], (err, results) => {
      if (err) {
        console.error('Error fetching featured vendors:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  } else {
    query += ' ORDER BY RAND() LIMIT 3'; // Randomly selects 3 vendors to display
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching featured vendors:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  }
};

exports.addVendor = (req, res) => {
  const { name, description, location, category } = req.body;
  const avatarPath = req.file ? `/uploads/${req.file.filename}` : '/public/images/avatar.png';

  const query = 'INSERT INTO vendorshops (name, description, location, category, avatar) VALUES (?, ?, ?, ?, ?)';
  const values = [name, description, location, category, avatarPath];

  // Execute SQL query
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding vendor:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.status(201).json({ message: 'Vendor added successfully', id: results.insertId });
  });
};
