const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const vendorsController = require('../controllers/vendorController');
const { exec } = require('child_process');
require('dotenv').config();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/vendors/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// Routes for vendors
router.get('/vendors', vendorsController.getAllVendors);
router.get('/vendors/:id', vendorsController.getVendorById);
router.get('/vendors-with-instagram', vendorsController.getVendorsWithInstagram);
router.get('/featured', vendorsController.getFeaturedVendors);
router.get('/taken-locations', vendorsController.getTakenLocations);

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

module.exports = router;
