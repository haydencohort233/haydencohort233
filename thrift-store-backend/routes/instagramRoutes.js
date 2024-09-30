const express = require('express');
const router = express.Router();
const instagramController = require('../controllers/instagramController');

// Route for fetching scraped Instagram posts by username
router.get('/scraped-posts/:username', instagramController.getScrapedPostsByUsername);

// Test route to ensure Instagram routes are working
router.get('/scraped-posts', async (req, res) => {
    try {
      const posts = await query('SELECT * FROM scraped_posts ORDER BY timestamp DESC');
      res.json(posts);
    } catch (error) {
      console.error('Error fetching scraped posts:', error); // Log the full error details
      res.status(500).json({ error: 'Failed to fetch scraped posts', details: error.message });
    }
  });  

module.exports = router;
