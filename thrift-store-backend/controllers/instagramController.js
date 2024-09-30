const db = require('../config/db');

// Fetch latest 3 Instagram posts by username
const getScrapedPostsByUsername = (req, res) => {
  const { username } = req.params;
  console.log(`Received username for scraped posts: ${username}`);

  const sqlQuery = `
    SELECT id, username, post_id, caption, media_url, video_url, timestamp
    FROM scraped_posts 
    WHERE username = ? 
    ORDER BY timestamp DESC 
    LIMIT 3
  `;

  db.query(sqlQuery, [username], (err, results) => {
    if (err) {
      console.error('Error fetching scraped posts:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No posts found for this username' });
    }
    res.json(results);
  });
};

module.exports = { getScrapedPostsByUsername };
