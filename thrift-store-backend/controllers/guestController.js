// guestController.js
const db = require('../config/db');
const path = require('path');

// Get all guest vendors
exports.getAllGuestVendors = (req, res) => {
  const query = `SELECT id, name, guestavatar, guestphoto, description, schedule, break FROM guestvendors ORDER BY name ASC`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching guest vendor data:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

// Get the latest guest vendor
exports.getLatestGuestVendor = (req, res) => {
  const query = `SELECT id, name, guestavatar, guestphoto, description, schedule, break FROM guestvendors ORDER BY id DESC LIMIT 1`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching latest guest vendor:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results[0]); // Send the latest guest vendor
  });
};

exports.addGuestVendor = (req, res) => {
  const { name, description, schedule } = req.body;
  const guestAvatarPath = req.files['guestavatar'] 
    ? `/uploads/vendors/guests/${req.files['guestavatar'][0].filename}` 
    : '/public/images/avatar.png';
  const guestPhotoPath = req.files['guestphoto'] 
    ? `/uploads/vendors/guests/${req.files['guestphoto'][0].filename}` 
    : null;

  // Insert new guest vendor data
  const query = 'INSERT INTO guestvendors (name, guestavatar, guestphoto, description, schedule, break) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, guestAvatarPath, guestPhotoPath, description, schedule, false];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding guest vendor:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.status(201).json({ message: 'Guest vendor added successfully', id: results.insertId });
  });
};
