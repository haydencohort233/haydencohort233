const db = require('../config/db');
const axios = require('axios');
const path = require('path');
const { logAction } = require('../utils/logHelper');
require('dotenv').config();

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

// 1. Get All Vendors
const getAllVendors = (req, res) => {
  const sort = req.query.sort || 'asc';
  let orderByClause = 'name ASC'; // Default sorting order

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

  const query = `SELECT id, name, description, location, category, avatar, vendorphoto, instagram_username, website_url, datecreated FROM vendorshops ORDER BY ${orderByClause}`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching vendor data:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

// 2. Get Featured Vendors
const getFeaturedVendors = (req, res) => {
  const { ids } = req.query;

  let query = 'SELECT id, name, description, location, category, avatar, vendorphoto, instagram_username, website_url, datecreated FROM vendorshops';
  
  if (ids) {
    const idArray = ids.split(',').map(id => parseInt(id, 10));
    query += ' WHERE id IN (?)';
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

// 3. Add Vendor
const addVendor = (req, res) => {
  const { name, description, location, category, instagram_username, website_url } = req.body;

  const avatarPath = req.files && req.files.avatar ? `/uploads/vendors/${req.files.avatar[0].filename}` : '/public/images/avatar.png';
  const vendorPhoto = req.files && req.files.vendorphoto ? `/uploads/vendors/${req.files.vendorphoto[0].filename}` : '/public/images/avatar.png';

  const dateCreated = new Date();
  const query = 'INSERT INTO vendorshops (name, description, location, category, avatar, vendorphoto, instagram_username, website_url, datecreated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [name, description, location, category, avatarPath, vendorPhoto, instagram_username, website_url, dateCreated];

  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding vendor:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    logAction('Vendor Added', name, results.insertId, adminUsername);
    res.status(201).json({ message: 'Vendor added successfully', id: results.insertId });
  });
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
  const { name, description, location, category, instagram_username, website_url } = req.body;
  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  const avatarPath = req.files && req.files.avatar ? `/uploads/vendors/${req.files.avatar[0].filename}` : null;
  const vendorPhotoPath = req.files && req.files.vendorphoto ? `/uploads/vendors/${req.files.vendorphoto[0].filename}` : null;

  let query = `UPDATE vendorshops SET name = ?, description = ?, location = ?, category = ?, instagram_username = ?, website_url = ?`;
  const values = [name, description, location, category, instagram_username, website_url];

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

// 6. Get Vendor by ID
const getVendorById = (req, res) => {
  const vendorId = req.params.id;
  const query = `SELECT id, name, description, location, category, avatar, vendorphoto, instagram_username, website_url FROM vendorshops WHERE id = ?`;
  
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

// 7. Get Vendors with Instagram
const getVendorsWithInstagram = (req, res) => {
  const query = `SELECT id, name, instagram_username FROM vendorshops WHERE instagram_username IS NOT NULL AND instagram_username != ''`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching vendors with Instagram:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
};

// 8. Scrape Vendor Instagram Posts
const scrapeVendorInstagramPosts = (req, res) => {
  exec('python scraper.py', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing scraper: ${err}`);
      return res.status(500).json({ error: 'Failed to execute scraper' });
    }

    console.log(`Scraper Output: ${stdout}`);
    if (stderr) {
      console.error(`Scraper Errors: ${stderr}`);
    }

    res.json({ message: 'Scraping completed', output: stdout });
  });
};

// 9. Get Scraped Posts by Instagram Username
// Check the function implementation
const getScrapedPostsByUsername = (req, res) => {
  const { username } = req.params; // Make sure this is correctly retrieved

  // Log the username for debugging
  console.log(`Received username for scraped posts: ${username}`);

  const query = `SELECT * FROM scraped_posts WHERE username = ? ORDER BY timestamp DESC LIMIT 3`;
  
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching scraped posts:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No posts found for this username' });
    }
    res.json(results);
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
  scrapeVendorInstagramPosts,
  getScrapedPostsByUsername
};
