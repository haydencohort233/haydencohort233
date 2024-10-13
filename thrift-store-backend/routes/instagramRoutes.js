const express = require('express');
const router = express.Router();
const { getInstagramPosts, getAllInstagramPosts, getInstagramPostById } = require('../controllers/instagramController');

// Route to fetch the latest posts for a specific Instagram user
router.get('/scraped-posts/:username', getInstagramPosts);

// Route to fetch all scraped posts
router.get('/scraped-posts', getAllInstagramPosts);

// Route to fetch a specific Instagram post by post_id
router.get('/scraped-post/:post_id', getInstagramPostById);

module.exports = router;
