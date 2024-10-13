const { query } = require('../config/db');

// Fetch the latest Instagram posts for a specific username
exports.getInstagramPosts = async (req, res) => {
  const { username } = req.params;

  try {
    // Query to fetch scraped Instagram posts from the database
    const sql = 'SELECT * FROM scraped_posts WHERE username = ? ORDER BY timestamp DESC LIMIT 3';
    const posts = await query(sql, [username]);

    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: 'No Instagram posts found for this user' });
    }
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
};

// Fetch all Instagram posts (with options for filtering)
exports.getAllInstagramPosts = async (req, res) => {
  try {
    // Query to fetch all scraped Instagram posts from the database
    const sql = 'SELECT * FROM scraped_posts ORDER BY timestamp DESC';
    const posts = await query(sql);

    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: 'No Instagram posts found' });
    }
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
};

// Fetch a specific Instagram post by post_id
exports.getInstagramPostById = async (req, res) => {
  const { post_id } = req.params;

  try {
    const sql = 'SELECT * FROM scraped_posts WHERE post_id = ?';
    const post = await query(sql, [post_id]);

    if (post.length > 0) {
      res.status(200).json(post[0]);
    } else {
      res.status(404).json({ message: 'Instagram post not found' });
    }
  } catch (error) {
    console.error('Error fetching Instagram post:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram post' });
  }
};
