const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const instagramController = require('../controllers/instagramController');

// Route for fetching all scraped Instagram posts
router.get('/scraped-posts', (req, res) => {
  const sqlQuery = 'SELECT * FROM scraped_posts ORDER BY timestamp DESC';

  query(sqlQuery, [], (err, results) => {
    if (err) {
      console.error('Error fetching scraped posts:', err);
      return res.status(500).json({
        error: 'Failed to fetch scraped posts',
        details: err.message
      });
    }
    res.json(results);
  });
});

router.get('/scraped-posts/:username', instagramController.getScrapedPostsByUsername);

module.exports = router;
