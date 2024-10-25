const mysql = require('mysql');
const logger = require('../utils/logger');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  charset: 'utf8mb4',
});

db.connect((err) => {
  if (err) {
    logger.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  }
  logger.info('Connected to the database.');
});

db.on('error', function(err) {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    logger.warn('Database connection was closed. Reconnecting...');
    handleDisconnect();
  } else {
    throw err;
  }
});

function handleDisconnect() {
  db.connect((err) => {
    if (err) {
      logger.error(`Error reconnecting to the database: ${err.message}`);
      setTimeout(handleDisconnect, 2000); // Try reconnecting after 2 seconds
    } else {
      logger.info('Reconnected to the database.');
    }
  });
}

function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        logger.error(`Error executing query: ${err.message}`);
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = { db, query };
