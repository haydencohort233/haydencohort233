const db = require('../config/db');
const path = require('path');
const { logAction } = require('../controllers/logsController');

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
    res.json(results[0]);
  });
};

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

  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding guest vendor:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    logAction('Guest Added', name, results.insertId, adminUsername);

    res.status(201).json({ message: 'Guest vendor added successfully', id: results.insertId });
  });
};

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

exports.editGuest = (req, res) => {
  const { id } = req.params;
  const { name, description, schedule } = req.body;

  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  // Handle new file uploads
  const guestAvatarPath = req.files['guestavatar'] 
    ? `/uploads/guests/${req.files['guestavatar'][0].filename}` 
    : null;
  const guestPhotoPath = req.files['guestphoto'] 
    ? `/uploads/guests/${req.files['guestphoto'][0].filename}` 
    : null;

  let query = 'UPDATE guestvendors SET name = ?, description = ?, schedule = ?';
  let values = [name, description, schedule];

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

    logAction('Guest Modified', name, id, adminUsername);

    res.json({ message: 'Guest updated successfully' });
  });
};

exports.deleteGuest = (req, res) => {
  const guestId = req.params.id;
  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  // Fetch the guest's name before deleting
  const getGuestQuery = `SELECT name FROM guestvendors WHERE id = ?`;
  db.query(getGuestQuery, [guestId], (err, guestResults) => {
    if (err || guestResults.length === 0) {
      return res.status(404).json({ error: 'Guest vendor not found' });
    }

    const guestName = guestResults[0].name;

    // Now delete the guest
    const deleteQuery = `DELETE FROM guestvendors WHERE id = ?`;
    db.query(deleteQuery, [guestId], (err, deleteResults) => {
      if (err) {
        console.error('Error deleting guest vendor:', err);
        return res.status(500).json({ error: 'Failed to delete guest vendor' });
      }

      if (deleteResults.affectedRows === 0) {
        return res.status(404).json({ error: 'Guest vendor not found' });
      }

      // Log the deletion action
      logAction('Guest Deleted', guestName, guestId, adminUsername);
      res.json({ message: `Guest vendor ${guestName} (ID: ${guestId}) deleted successfully` });
    });
  });
};
