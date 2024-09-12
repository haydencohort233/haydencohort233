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

// Get guest vendor by ID
exports.getGuestVendorById = (req, res) => {
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

// Add a guest vendor
exports.addGuestVendor = (req, res) => {
  const { name, description, schedule } = req.body;
  const guestAvatarPath = req.files['guestavatar'] 
    ? `/uploads/vendors/guests/${req.files['guestavatar'][0].filename}` 
    : '/public/images/avatar.png';
  const guestPhotoPath = req.files['guestphoto'] 
    ? `/uploads/vendors/guests/${req.files['guestphoto'][0].filename}` 
    : null;

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

// Toggle guest vendor break status
exports.toggleGuestVendorBreak = (req, res) => {
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
exports.editGuestVendor = (req, res) => {
  const { id } = req.params;
  const { name, description, schedule } = req.body;

  // Handle new file uploads
  const guestAvatarPath = req.files['guestavatar'] 
    ? `/uploads/vendors/guests/${req.files['guestavatar'][0].filename}` 
    : null;
  const guestPhotoPath = req.files['guestphoto'] 
    ? `/uploads/vendors/guests/${req.files['guestphoto'][0].filename}` 
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
      console.error('Error updating guest vendor:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Guest vendor not found' });
    }

    res.json({ message: 'Guest vendor updated successfully' });
  });
};
