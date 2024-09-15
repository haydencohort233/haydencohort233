const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Connect to the MySQL database
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'your_database',
});

// Status route
router.get('/status', (req, res) => {
  const statusData = {
    dbStatus: false,
    dbSize: 'Unknown',
    uptime: process.uptime(),
    lastBackup: 'Unknown',
    backupSize: 'Unknown',
    backupStatus: 'Unknown',
    largestTable: 'Unknown',
    mostRecentEntry: 'Unknown',
  };

  // Get the most recent backup
  const backupDir = path.join(__dirname, '..', 'backups');
  const backupFiles = fs.readdirSync(backupDir).filter(file => file.endsWith('.sql'));

  if (backupFiles.length > 0) {
    const latestBackup = backupFiles[backupFiles.length - 1];
    const stats = fs.statSync(path.join(backupDir, latestBackup));

    statusData.lastBackup = latestBackup;
    statusData.backupSize = `${(stats.size / (1024 * 1024)).toFixed(2)} MB`;
    statusData.backupStatus = 'Success';
  }

  // Check DB connection
  db.ping((err) => {
    if (err) {
      console.error('Database offline:', err);
      return res.json(statusData); // Send statusData with default values if DB is offline
    }

    statusData.dbStatus = true;

    // Get database size
    db.query('SELECT SUM(data_length + index_length) / 1024 / 1024 AS size FROM information_schema.tables WHERE table_schema = ?', [process.env.DB_NAME], (err, result) => {
      if (!err && result.length > 0) {
        statusData.dbSize = `${result[0].size.toFixed(2)} MB`;
      }

      // Find the largest table
      db.query('SELECT table_name, data_length + index_length AS size FROM information_schema.tables WHERE table_schema = ? ORDER BY size DESC LIMIT 1', [process.env.DB_NAME], (err, result) => {
        if (!err && result.length > 0) {
          statusData.largestTable = result[0].table_name;
        }

        // Find the most recent table entry
        db.query('SELECT table_name, update_time FROM information_schema.tables WHERE table_schema = ? ORDER BY update_time DESC LIMIT 1', [process.env.DB_NAME], (err, result) => {
          if (!err && result.length > 0) {
            statusData.mostRecentEntry = result[0].table_name;
          }

          // Send final status data
          res.json(statusData);  // Make sure this is a valid JSON response
        });
      });
    });
  });
});

// Backup route
router.get('/backup', (req, res) => {
  const timestamp = new Date().toISOString().replace(/:/g, '-'); // For file naming
  const backupDir = path.join(__dirname, '..', 'backups');
  const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

  const mysqldumpPath = `"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe"`;

  const passwordPart = process.env.DB_PASS ? `--password=${process.env.DB_PASS}` : '';

  // Add --column-statistics=0 to suppress the warning
  const dumpCommand = `${mysqldumpPath} --user=${process.env.DB_USER} ${passwordPart} --host=${process.env.DB_HOST} --column-statistics=0 ${process.env.DB_NAME} > "${backupFile}"`;

  exec(dumpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during backup: ${error.message}`);
      return res.status(500).json({ error: `Backup failed: ${error.message}` }); // Returning proper JSON error
    }

    if (stderr) {
      console.error(`Backup stderr: ${stderr}`);
    }

    // Send a JSON response indicating success
    res.status(200).json({ message: 'Backup successful', backupFile });
  });
});

module.exports = router;
