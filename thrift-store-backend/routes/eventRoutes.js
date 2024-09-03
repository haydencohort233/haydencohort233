const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

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
  limits: { fileSize: 2 * 1024 * 1024 } // File size limit (2MB)
});

// Get the next 3 upcoming events
router.get('/events/upcoming', (req, res) => {
  const query = `
    SELECT id, title, date, time, description, preview_text, photo_url, title_photo 
    FROM chasingevents 
    WHERE date >= CURDATE() 
    ORDER BY date ASC, time ASC 
    LIMIT 3`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Add a new event
router.post('/events', upload.single('photo'), (req, res) => {
  const { title, date, time, description, preview_text } = req.body;
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const titlePhoto = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `
    INSERT INTO chasingevents (title, date, time, description, preview_text, photo_url, title_photo) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [title, date, time, description, preview_text, photoUrl, titlePhoto];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error adding event:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.status(201).json({ message: 'Event added successfully', id: results.insertId });
  });
});

module.exports = router;
