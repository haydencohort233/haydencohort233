const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const eventController = require('../controllers/eventController');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events/');
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
  limits: { fileSize: 2 * 1024 * 1024 } // File size limit (2MB)
});

// Use upload.fields to handle multiple file uploads
const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },        // Handles the 'photo' file
  { name: 'title_photo', maxCount: 1 }   // Handles the 'title_photo' file
]);

router.get('/events/upcoming', eventController.getUpcomingEvents);
router.get('/events', eventController.getAllEvents);

// Use the new `uploadFields` middleware for handling both files
router.post('/events', uploadFields, eventController.addEvent);
router.patch('/events/:id', uploadFields, eventController.updateEvent);
router.get('/events/:id', eventController.getEventById);

module.exports = router;
