const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getAllGuestVendors, addGuestVendor } = require('../controllers/guestController');

// Configure multer storage for guest vendor images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/vendors/guests/');
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
  limits: { fileSize: 2 * 1024 * 1024 }, // File size limit (2MB)
}).fields([
  { name: 'guestavatar', maxCount: 1 },
  { name: 'guestphoto', maxCount: 1 },
]);

// GET all guest vendors
router.get('/guests', getAllGuestVendors);

// POST to add a guest vendor
router.post('/guests', upload, addGuestVendor);

module.exports = router;
