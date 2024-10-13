const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectTimeout: 10000, // 10 seconds
  acquireTimeout: 10000,  // 10 seconds
  charset: 'utf8mb4', // Support emojis in captions
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database.');
});

db.on('error', function(err) {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed. Reconnecting...');
    handleDisconnect();
  } else {
    throw err;
  }
});

function handleDisconnect() {
  db.connect((err) => {
    if (err) {
      console.error('Error reconnecting to the database:', err.message);
      setTimeout(handleDisconnect, 2000); // Try reconnecting after 2 seconds
    } else {
      console.log('Reconnected to the database.');
    }
  });
}

function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = { db, query };
