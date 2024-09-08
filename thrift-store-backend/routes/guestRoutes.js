// routes/guestRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { getAllGuestVendors, addGuestVendor, getLatestGuestVendor } = require('../controllers/guestController');

// Configure multer storage for guest vendor images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/vendors/guests/'); // Set the destination folder for uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename with a timestamp
  }
});

// File filter to accept only .jpg and .png files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/; // Allow only JPEG and PNG files
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only .jpg and .png files are allowed!')); // Reject the file with an error message
  }
};

// Initialize multer with storage, file filter, and file size limit (2MB)
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

// GET the latest guest vendor
router.get('/guests/latest', getLatestGuestVendor);

// POST to add a guest vendor
router.post('/guests', upload, addGuestVendor);

module.exports = router;
