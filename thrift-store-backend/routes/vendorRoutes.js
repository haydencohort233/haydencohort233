const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const vendorsController = require('../controllers/vendorController');
const { promisify } = require('util');
const db = require('../config/db');
const query = promisify(db.query).bind(db); // Promisify db.query for async/await
const { fetchVendorInstagramPosts } = require('../controllers/vendorController');

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

// GET vendors with Instagram filled out
router.get('/vendors-with-instagram', vendorsController.getVendorsWithInstagram);

// GET featured vendors
router.get('/featured', vendorsController.getFeaturedVendors);

// DELETE a vendor by ID
router.delete('/vendors/:id', vendorsController.deleteVendor);

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



router.get('/vendors-instagram-posts', async (req, res) => {
  const { selectedVendors } = req.query;

  if (!selectedVendors || selectedVendors.length === 0) {
    return res.json([]); // Return an empty array if no vendors are selected
  }

  const vendorIds = selectedVendors.split(',').map(id => parseInt(id, 10));

  try {
    // Fetch vendors from the database
    const vendors = await query(
      'SELECT id, name, instagram FROM vendorshops WHERE id IN (?) AND instagram IS NOT NULL AND instagram != ""',
      [vendorIds]
    );

    // Fetch Instagram posts for each selected vendor
    const vendorPostsPromises = vendors.map(async (vendor) => {
      console.log(`Fetching posts for vendor: ${vendor.name} (${vendor.instagram})`);
      const posts = await fetchVendorInstagramPosts(vendor.instagram);
      return {
        vendor: vendor.name,
        posts: posts || [],
      };
    });

    const vendorPosts = await Promise.all(vendorPostsPromises);
    console.log('Vendor Posts:', vendorPosts);
    res.json(vendorPosts);
  } catch (error) {
    console.error('Error fetching vendor Instagram posts:', error);
    res.status(500).json({ message: 'Error fetching vendor Instagram posts' });
  }
});

module.exports = router;
