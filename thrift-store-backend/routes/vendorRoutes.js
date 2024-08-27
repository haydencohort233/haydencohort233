const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getAllVendors, getFeaturedVendors, addVendor } = require('../controllers/vendorController');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename with a timestamp
  }
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
  limits: { fileSize: 2 * 1024 * 1024 } // Set file size limit (2MB)
});

// GET all vendors
router.get('/vendors', getAllVendors);

// GET featured vendors
router.get('/featured', getFeaturedVendors);

// POST to add a vendor
router.post('/vendors', upload.single('avatar'), addVendor);

module.exports = router;
