const db = require('../config/db'); // Ensure this points to your MySQL database configuration
const path = require('path');

// Get all blogs
exports.getAllBlogs = (req, res) => {
  const limit = req.query.limit ? `LIMIT ${parseInt(req.query.limit)}` : '';
  const query = `SELECT * FROM chasingblogs ORDER BY date DESC ${limit}`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching blogs:', error);
      return res.status(500).json({ error: 'Failed to fetch blogs' });
    }
    res.status(200).json(results);
  });
};

// Get single blog by ID
exports.getSingleBlog = (req, res) => {
  const query = 'SELECT * FROM chasingblogs WHERE id = ?';
  db.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error('Error fetching the blog:', error);
      return res.status(500).json({ error: 'Failed to fetch the blog' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(results[0]);
  });
};

exports.createBlog = (req, res) => {
    try {
      console.log('Create blog endpoint accessed'); // Log when the endpoint is accessed
      console.log('Request body:', req.body); // Log request body content
      console.log('Request file:', req.file); // Log file details if any
  
      const { title, content, date, preview_text } = req.body;
      const photo_url = req.file ? `/uploads/blogs/${req.file.filename}` : null;
  
      if (!title || !content || !date) {
        return res.status(400).json({ error: 'Title, content, and date are required' });
      }
  
      const query = 'INSERT INTO chasingblogs (title, content, date, preview_text, photo_url) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [title, content, date, preview_text, photo_url], (error, results) => {
        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ error: 'Failed to create blog' });
        }
        res.status(201).json({
          message: 'Blog created successfully',
          blog: {
            id: results.insertId,
            title,
            content,
            date,
            preview_text,
            photo_url,
          },
        });
      });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
// Update a blog
exports.updateBlog = (req, res) => {
  const { title, content, date, preview_text } = req.body;
  const photo_url = req.file ? `/uploads/blogs/${req.file.filename}` : null;

  const query = `
    UPDATE chasingblogs SET
      title = ?,
      content = ?,
      date = ?,
      preview_text = ?,
      photo_url = ?
    WHERE id = ?
  `;
  db.query(query, [title, content, date, preview_text, photo_url, req.params.id], (error, results) => {
    if (error) {
      console.error('Error updating blog:', error);
      return res.status(500).json({ error: 'Failed to update blog' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog updated successfully' });
  });
};

// Delete a blog
exports.deleteBlog = (req, res) => {
  const query = 'DELETE FROM chasingblogs WHERE id = ?';
  db.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error('Error deleting blog:', error);
      return res.status(500).json({ error: 'Failed to delete blog' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  });
};
