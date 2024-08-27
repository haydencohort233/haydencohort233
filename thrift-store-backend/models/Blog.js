const db = require('../config/database');

// Define the create table query if the table doesn't already exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS chasingblogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL,
    preview_text VARCHAR(255),
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

// Initialize the table when the application starts
db.query(createTableQuery, (err) => {
  if (err) throw err;
  console.log('chasingblogs table ready');
});

// Function to create a new blog entry
const createBlog = (data, callback) => {
  const query = `
    INSERT INTO chasingblogs (title, content, date, preview_text, photo_url)
    VALUES (?, ?, ?, ?, ?);
  `;
  db.query(query, [data.title, data.content, data.date, data.preview_text, data.photo_url], callback);
};

// Function to fetch all blog entries
const getAllBlogs = (callback) => {
  const query = 'SELECT * FROM chasingblogs ORDER BY date DESC;';
  db.query(query, callback);
};

// Function to fetch a single blog by ID
const getBlogById = (id, callback) => {
  const query = 'SELECT * FROM chasingblogs WHERE id = ?;';
  db.query(query, [id], callback);
};

// Function to update a blog entry
const updateBlog = (id, data, callback) => {
  const query = `
    UPDATE chasingblogs
    SET title = ?, content = ?, date = ?, preview_text = ?, photo_url = ?
    WHERE id = ?;
  `;
  db.query(query, [data.title, data.content, data.date, data.preview_text, data.photo_url, id], callback);
};

// Function to delete a blog entry
const deleteBlog = (id, callback) => {
  const query = 'DELETE FROM chasingblogs WHERE id = ?;';
  db.query(query, [id], callback);
};

// Export the functions for use in the controller
module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
