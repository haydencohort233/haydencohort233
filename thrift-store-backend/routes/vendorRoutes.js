const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const vendorsController = require('../controllers/vendorController');
const { promisify } = require('util');
const db = require('../config/db');
const query = promisify(db.query).bind(db); // Promisify db.query for async/await
const { fetchVendorInstagramPosts } = require('../controllers/vendorController');
require('dotenv').config();
const { exec } = require('child_process'); // For executing Python script

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/vendors/'); // Save files to 'uploads/vendors/' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename with a timestamp
  },
});

// File filter to accept only .jpg and .png files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg and .png files are allowed!'));
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Set file size limit (2MB)
});

// Routes for vendors
router.get('/vendors', vendorsController.getAllVendors);
router.get('/vendors/:id', vendorsController.getVendorById);
router.get('/vendors-with-instagram', vendorsController.getVendorsWithInstagram);
router.get('/featured', vendorsController.getFeaturedVendors);
router.delete('/vendors/:id', vendorsController.deleteVendor);
router.post('/vendors', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'vendorphoto', maxCount: 1 },
]), vendorsController.addVendor);
router.put('/vendors/:id', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'vendorphoto', maxCount: 1 },
]), vendorsController.updateVendor);

// Route to trigger the scraping process
router.get('/scrape', (req, res) => {
  exec('python scraper.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      return res.status(500).json({ message: 'Error during scraping, please try again.' });
    }
    
    console.log(`Scraping output: ${stdout}`);
    res.json({ message: 'Scraping completed successfully!' });
  });
});

router.get('/scraped-posts', async (req, res) => {
  try {
    const posts = await query('SELECT * FROM scraped_posts ORDER BY timestamp DESC');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching scraped posts:', error);
    res.status(500).json({ error: 'Failed to fetch scraped posts' });
  }
});

module.exports = router;
