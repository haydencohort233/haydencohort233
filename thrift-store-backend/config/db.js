const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectTimeout: 10000, // 10 seconds timeout for connection
  acquireTimeout: 10000,  // 10 seconds timeout for acquiring connection
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to the database.');
});

// Utility function to handle queries with both callback and Promise support
function query(sql, params, callback) {
  // If no callback is passed, return a Promise
  if (typeof callback === 'undefined') {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  } else {
    // If a callback is passed, use the callback style
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return callback(err, null); // Call the callback with error
      }
      callback(null, results); // Call the callback with results
    });
  }
}

module.exports = { db, query };
