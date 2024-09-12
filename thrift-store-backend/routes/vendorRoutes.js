const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const vendorsController = require('../controllers/vendorController');

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

// GET all vendors
router.get('/vendors', vendorsController.getAllVendors);

// GET a vendor by ID
router.get('/vendors/:id', vendorsController.getVendorById);

// GET featured vendors
router.get('/featured', vendorsController.getFeaturedVendors);

// POST to add a vendor
router.post('/vendors', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'vendorphoto', maxCount: 1 },
]), vendorsController.addVendor);

// PUT to update a vendor
router.put('/vendors/:id', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'vendorphoto', maxCount: 1 },
]), vendorsController.updateVendor);

module.exports = router;
