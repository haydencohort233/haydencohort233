const db = require('../config/db');
const axios = require('axios');
const path = require('path');
const { logAction } = require('../controllers/logsController');
const { query } = require('../config/db');
require('dotenv').config();

// 1. Get All Vendors
const getAllVendors = async (req, res) => {
  const sort = req.query.sort || 'asc';
  let orderByClause = 'name ASC';

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

  const sqlQuery = `SELECT id, name, description, location, category, avatar, vendorphoto, instagram_username, website_url, datecreated, sale FROM vendorshops ORDER BY ${orderByClause}`;

  try {
    const results = await query(sqlQuery);
    res.json(results);
  } catch (err) {
    console.error('Error fetching vendor data:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// 2. Get Featured Vendors
const getFeaturedVendors = async (req, res) => {
  const { ids } = req.query;

  let sqlQuery = 'SELECT id, name, description, location, category, avatar, vendorphoto, instagram_username, website_url, datecreated FROM vendorshops';
  
  try {
    if (ids) {
      const idArray = ids.split(',').map(id => parseInt(id, 10));
      sqlQuery += ' WHERE id IN (?)';
      const results = await query(sqlQuery, [idArray]);
      res.json(results);
    } else {
      sqlQuery += ' ORDER BY RAND() LIMIT 10';
      const results = await query(sqlQuery);
      res.json(results);
    }
  } catch (err) {
    console.error('Error fetching featured vendors:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// 3. Add Vendor
const addVendor = async (req, res) => {
  const { name, description, location, category, instagram_username, website_url, sale } = req.body;

  const avatarPath = req.files && req.files.avatar ? `/uploads/vendors/${req.files.avatar[0].filename}` : '/public/images/avatar.png';
  const vendorPhoto = req.files && req.files.vendorphoto ? `/uploads/vendors/${req.files.vendorphoto[0].filename}` : '/public/images/avatar.png';

  const dateCreated = new Date();
  const sqlQuery = 'INSERT INTO vendorshops (name, description, location, category, avatar, vendorphoto, instagram_username, website_url, datecreated, sale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [name, description, location, category, avatarPath, vendorPhoto, instagram_username, website_url, dateCreated, sale || 0];

  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  try {
    const results = await query(sqlQuery, values);
    logAction('Vendor Added', name, results.insertId, adminUsername);
    res.status(201).json({ message: 'Vendor added successfully', id: results.insertId });
  } catch (err) {
    console.error('Error adding vendor:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// 4. Delete Vendor
const deleteVendor = (req, res) => {
  const vendorId = req.params.id;
  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  const getVendorQuery = `SELECT name FROM vendorshops WHERE id = ?`;
  db.query(getVendorQuery, [vendorId], (err, vendorResults) => {
    if (err || vendorResults.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const vendorName = vendorResults[0].name;
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

// 5. Update Vendor
const updateVendor = (req, res) => {
  const vendorId = req.params.id;
  const { name, description, location, category, instagram_username, website_url, sale } = req.body;
  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  const avatarPath = req.files && req.files.avatar ? `/uploads/vendors/${req.files.avatar[0].filename}` : null;
  const vendorPhotoPath = req.files && req.files.vendorphoto ? `/uploads/vendors/${req.files.vendorphoto[0].filename}` : null;

  let sqlQuery = `UPDATE vendorshops SET name = ?, description = ?, location = ?, category = ?, instagram_username = ?, website_url = ?, sale = ?`;
  const values = [name, description, location, category, instagram_username, website_url, sale];

  if (avatarPath) {
    sqlQuery += `, avatar = ?`;
    values.push(avatarPath);
  }

  if (vendorPhotoPath) {
    sqlQuery += `, vendorphoto = ?`;
    values.push(vendorPhotoPath);
  }

  sqlQuery += ` WHERE id = ?`;
  values.push(vendorId);

  db.query(sqlQuery, values, (err, results) => {
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

// 6. Get Vendor by ID
const getVendorById = async (req, res) => {
  console.log('Request received for vendor ID:', req.params.id); // Log the request
  try {
    const vendorId = req.params.id;
    const result = await query('SELECT * FROM vendorshops WHERE id = ?', [vendorId]);
    if (result.length === 0) {
      console.log('Vendor not found:', vendorId); // Log if vendor is not found
      return res.status(404).json({ message: 'Vendor not found' });
    }
    console.log('Vendor data fetched:', result[0]); // Log the fetched data
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching vendor data:', error);
    res.status(500).json({ error: 'Failed to fetch vendor data' });
  }
};

// 7. Get Vendors with Instagram
const getVendorsWithInstagram = (req, res) => {
  const sqlQuery = `SELECT id, name, instagram_username FROM vendorshops WHERE instagram_username IS NOT NULL AND instagram_username != ''`;

  db.query(sqlQuery, (err, results) => {
    if (err) {
      console.error('Error fetching vendors with Instagram:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

// 8. Get all taken locations (new)
const getTakenLocations = (req, res) => {
  const query = 'SELECT location FROM vendorshops WHERE location IS NOT NULL';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching taken locations:', err);
      return res.status(500).json({ message: 'Error fetching taken locations' });
    }

    // Map the results to an array of locations
    const takenLocations = results.map((row) => row.location);
    res.json(takenLocations);
  });
};

// 9. Get all taken vendor IDs (new)
const getTakenVendorIds = (req, res) => {
  const query = 'SELECT vendor_id FROM login_vendors WHERE vendor_id IS NOT NULL';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching taken vendor IDs:', err);
      return res.status(500).json({ message: 'Error fetching taken vendor IDs' });
    }

    // Map the results to an array of vendor IDs
    const takenVendorIds = results.map((row) => row.vendor_id);
    res.json(takenVendorIds);
  });
};

// Correctly export all functions
module.exports = {
  getAllVendors,
  getVendorById,
  getVendorsWithInstagram,
  getFeaturedVendors,
  addVendor,
  deleteVendor,
  updateVendor,
  getTakenLocations,
  getTakenVendorIds
};
