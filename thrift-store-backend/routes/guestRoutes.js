const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  getAllGuestVendors,
  getGuestVendorById,  // Import the new controller method
  addGuestVendor,
  getLatestGuestVendor,
  editGuestVendor,
  toggleGuestVendorBreak
} = require('../controllers/guestController');

// Configure multer storage and upload setup (same as before)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/vendors/guests/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

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

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
}).fields([
  { name: 'guestavatar', maxCount: 1 },
  { name: 'guestphoto', maxCount: 1 }
]);

// Add the route for fetching a guest vendor by ID
router.get('/guests/:id', getGuestVendorById); // New route

router.get('/guests', getAllGuestVendors);
router.get('/guests/latest', getLatestGuestVendor);
router.post('/guests', upload, addGuestVendor);
router.patch('/guests/:id', upload, editGuestVendor);
router.patch('/guests/:id/toggle-break', toggleGuestVendorBreak);

module.exports = router;
