const db = require('../config/db');
const path = require('path');
const { logAction } = require('../utils/logHelper');

// Get all guest vendors
exports.getAllGuests = (req, res) => {
  const query = `SELECT id, name, guestavatar, guestphoto, description, schedule, break FROM guestvendors ORDER BY name ASC`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching guest vendor data:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

// Get guest vendor by ID
exports.getGuestById = (req, res) => {
  const { id } = req.params; // Get the guest ID from the route parameter

  const query = `SELECT id, name, guestavatar, guestphoto, description, schedule, break FROM guestvendors WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching guest vendor by ID:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Guest vendor not found' });
    }

    res.json(results[0]); // Send the guest vendor data
  });
};

// Get latest guest vendor
exports.getLatestGuest = (req, res) => {
  const query = `SELECT id, name, guestavatar, guestphoto, description, schedule, break FROM guestvendors ORDER BY id DESC LIMIT 1`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching latest guest vendor:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No guest vendors available' });
    }
    res.json(results[0]); // Send the latest guest vendor
  });
};

// Add a guest vendor
exports.addGuest = (req, res) => {
  const { name, description, schedule } = req.body;
  const guestAvatarPath = req.files['guestavatar'] 
    ? `/uploads/vendors/guests/${req.files['guestavatar'][0].filename}` 
    : '/public/images/avatar.png';
  const guestPhotoPath = req.files['guestphoto'] 
    ? `/uploads/vendors/guests/${req.files['guestphoto'][0].filename}` 
    : null;

  const query = 'INSERT INTO guestvendors (name, guestavatar, guestphoto, description, schedule, break) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, guestAvatarPath, guestPhotoPath, description, schedule, false];

  // Retrieve the admin username from the request header
  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding guest vendor:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // Log the action with the admin username
    logAction('Added', name, results.insertId, adminUsername);

    res.status(201).json({ message: 'Guest vendor added successfully', id: results.insertId });
  });
};

// Toggle guest vendor break status
exports.toggleGuestBreak = (req, res) => {
  const { id } = req.params;
  const { break: breakStatus } = req.body;

  const query = 'UPDATE guestvendors SET break = ? WHERE id = ?';
  const values = [breakStatus, id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating break status:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Guest vendor not found' });
    }

    res.json({ message: 'Break status updated successfully' });
  });
};

// Edit guest vendor
exports.editGuest = (req, res) => {
  const { id } = req.params;
  const { name, description, schedule } = req.body;

  // Retrieve the admin username from the request header
  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  // Handle new file uploads
  const guestAvatarPath = req.files['guestavatar'] 
    ? `/uploads/guests/${req.files['guestavatar'][0].filename}` 
    : null;
  const guestPhotoPath = req.files['guestphoto'] 
    ? `/uploads/guests/${req.files['guestphoto'][0].filename}` 
    : null;

  // Update query
  let query = 'UPDATE guestvendors SET name = ?, description = ?, schedule = ?';
  let values = [name, description, schedule];

  // Add file paths to query if provided
  if (guestAvatarPath) {
    query += ', guestavatar = ?';
    values.push(guestAvatarPath);
  }
  if (guestPhotoPath) {
    query += ', guestphoto = ?';
    values.push(guestPhotoPath);
  }
  query += ' WHERE id = ?';
  values.push(id);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating guest:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    // Log the action with the correct guest name, ID, and admin username
    logAction('Guest Modified', name, id, adminUsername);

    res.json({ message: 'Guest updated successfully' });
  });
};
