const db = require('../config/db');
const { logAction } = require('../controllers/logsController');

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

      const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';
      const logMessage = `Blog titled "${title}" was added by ${adminUsername} (ID: ${results.insertId})`;
      logAction('blog', logMessage);

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

exports.updateBlog = (req, res) => {
  const { title, content, date, preview_text } = req.body;
  const photo_url = req.file ? `/uploads/blogs/${req.file.filename}` : null;

  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

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

    const logMessage = `Blog with ID ${req.params.id} was updated by ${adminUsername} with title "${title}"`;
    logAction('blog', logMessage);

    res.status(200).json({ message: 'Blog updated successfully' });
  });
};

exports.deleteBlog = (req, res) => {
  const query = 'DELETE FROM chasingblogs WHERE id = ?';
  const adminUsername = req.headers['x-admin-username'] || 'Unknown Admin';

  db.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error('Error deleting blog:', error);
      return res.status(500).json({ error: 'Failed to delete blog' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const logMessage = `Blog with ID ${req.params.id} was deleted by ${adminUsername}`;
    logAction('blog', logMessage);

    res.status(200).json({ message: 'Blog deleted successfully' });
  });
};
