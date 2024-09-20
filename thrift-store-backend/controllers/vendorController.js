const db = require('../config/db');
const path = require('path');
const { logAction } = require('../utils/logHelper');

exports.getAllVendors = (req, res) => {
  const sort = req.query.sort || 'asc';
  let orderByClause = 'name ASC'; // Default sorting order

  // Determine the sorting order
  switch (sort) {
    case 'asc':
      orderByClause = 'name ASC';
      break;
    case 'desc':
      orderByClause = 'name DESC';
      break;
    case 'new':
      orderByClause = 'datecreated DESC';
      break;
    case 'old':
      orderByClause = 'datecreated ASC';
      break;
    default:
      orderByClause = 'name ASC';
  }

  const query = `SELECT id, name, description, location, category, avatar, vendorphoto, datecreated FROM vendorshops ORDER BY ${orderByClause}`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching vendor data:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

exports.getFeaturedVendors = (req, res) => {
  const { ids } = req.query;

  let query = 'SELECT id, name, description, location, category, avatar, vendorphoto, datecreated FROM vendorshops';
  
  if (ids) {
    const idArray = ids.split(',').map(id => parseInt(id, 10));
    query += ' WHERE id IN (?)'; // Use parameterized query
    db.query(query, [idArray], (err, results) => {
      if (err) {
        console.error('Error fetching featured vendors:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  } else {
    query += ' ORDER BY RAND() LIMIT 10';
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

  const avatarPath = req.files && req.files.avatar ? `/uploads/vendors/${req.files.avatar[0].filename}` : '/public/images/avatar.png';
  const vendorPhoto = req.files && req.files.vendorphoto ? `/uploads/vendors/${req.files.vendorphoto[0].filename}` : '/public/images/avatar.png';

  const dateCreated = new Date();
  const query = 'INSERT INTO vendorshops (name, description, location, category, avatar, vendorphoto, datecreated) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [name, description, location, category, avatarPath, vendorPhoto, dateCreated];

  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding vendor:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    logAction('Vendor Added', name, results.insertId, adminUsername); // Log action with name and vendor ID
    res.status(201).json({ message: 'Vendor added successfully', id: results.insertId });
  });
};

exports.deleteVendor = (req, res) => {
  const vendorId = req.params.id;
  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  // Get vendor's name before deleting
  const getVendorQuery = `SELECT name FROM vendorshops WHERE id = ?`;
  db.query(getVendorQuery, [vendorId], (err, vendorResults) => {
    if (err || vendorResults.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const vendorName = vendorResults[0].name;

    // Now delete the vendor
    const deleteQuery = `DELETE FROM vendorshops WHERE id = ?`;
    db.query(deleteQuery, [vendorId], (err, deleteResults) => {
      if (err) {
        console.error('Error deleting vendor:', err);
        return res.status(500).json({ error: 'Failed to delete vendor' });
      }

      if (deleteResults.affectedRows === 0) {
        return res.status(404).json({ error: 'Vendor not found' });
      }

      logAction('Vendor Deleted', vendorName, vendorId, adminUsername);
      res.json({ message: `Vendor ${vendorName} (ID: ${vendorId}) deleted successfully` });
    });
  });
};

exports.updateVendor = (req, res) => {
  const vendorId = req.params.id;
  const { name, description, location, category } = req.body;
  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  const avatarPath = req.files && req.files.avatar ? `/uploads/vendors/${req.files.avatar[0].filename}` : null;
  const vendorPhotoPath = req.files && req.files.vendorphoto ? `/uploads/vendors/${req.files.vendorphoto[0].filename}` : null;

  let query = `UPDATE vendorshops SET name = ?, description = ?, location = ?, category = ?`;
  const values = [name, description, location, category];

  if (avatarPath) {
    query += `, avatar = ?`;
    values.push(avatarPath);
  }

  if (vendorPhotoPath) {
    query += `, vendorphoto = ?`;
    values.push(vendorPhotoPath);
  }

  query += ` WHERE id = ?`;
  values.push(vendorId);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating vendor:', err);
      return res.status(500).json({ error: 'Failed to update vendor' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    logAction('Vendor Modified', name, vendorId, adminUsername);
    res.json({ message: `Vendor ${name} (ID: ${vendorId}) updated successfully` });
  });
};

exports.getVendorById = (req, res) => {
  const vendorId = req.params.id;

  const query = `SELECT id, name, description, location, category, avatar, vendorphoto FROM vendorshops WHERE id = ?`;
  
  db.query(query, [vendorId], (err, results) => {
    if (err) {
      console.error('Error fetching vendor by ID:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json(results[0]);
  });
};
