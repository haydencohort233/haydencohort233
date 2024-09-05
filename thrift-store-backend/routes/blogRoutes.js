const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/blogs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage for blog photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blogs/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to accept only .jpg and .png files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG are allowed!'), false);
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// GET route for fetching all blogs
router.get('/blogs', getAllBlogs);

// GET route for fetching a single blog by ID
router.get('/blogs/:id', getSingleBlog);

// POST route for creating a blog with photo upload
router.post('/blogs', upload.single('photo'), createBlog);

// PUT route for updating a blog, with optional photo upload
router.put('/blogs/:id', upload.single('photo'), updateBlog);

// DELETE route for deleting a blog
router.delete('/blogs/:id', deleteBlog);

module.exports = router;
