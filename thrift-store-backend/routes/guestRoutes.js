const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  getAllGuests,
  getGuestById,  
  addGuest,
  getLatestGuest,
  editGuest,
  toggleGuestBreak
} = require('../controllers/guestController');

// Configure multer storage and upload setup
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

// Define the routes
router.get('/guests/:id', getGuestById);
router.get('/guests', getAllGuests);
router.get('/guests/latest', getLatestGuest);
router.post('/guests', upload, addGuest);
router.patch('/guests/:id', upload, editGuest);
router.patch('/guests/:id/toggle-break', toggleGuestBreak);

module.exports = router;
