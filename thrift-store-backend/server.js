const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./config/db');
require('dotenv').config();

const vendorRoutes = require('./routes/vendorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const blogRoutes = require('./routes/blogRoutes');
const guestRoutes = require('./routes/guestRoutes');
const statusRoutes = require('./routes/statusRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'X-Admin-Username'],
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Add logging middleware
app.use(morgan('dev'));

// Route integrations
app.use('/api', vendorRoutes);
app.use('/api', eventRoutes);
app.use('/api', blogRoutes);
app.use('/api', guestRoutes);
app.use('/api', statusRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Status route
app.get('/api/status', (req, res) => {
  const statusData = {
    dbStatus: false,
    dbSize: 'N/A',
    uptime: 'N/A',
    lastBackup: 'N/A',
    backupSize: 'N/A',
    backupSuccess: 'N/A',
    largestTable: 'N/A',
    mostRecentEntry: 'N/A',
  };

  // Check if the database is connected
  db.ping((err) => {
    if (err) {
      // Respond with statusData and set the correct Content-Type header
      return res.status(200).json(statusData); // Make sure it's using res.json()
    }

    statusData.dbStatus = true; // If no error, DB is online

    // Get database size
    db.query('SELECT SUM(data_length + index_length) AS size FROM information_schema.tables WHERE table_schema = ?', [process.env.DB_NAME], (err, result) => {
      if (!err && result && result[0]) {
        statusData.dbSize = `${(result[0].size / (1024 * 1024)).toFixed(2)} MB`; // Convert to MB
      }

      // Get the largest table
      db.query('SELECT table_name, data_length + index_length AS size FROM information_schema.tables WHERE table_schema = ? ORDER BY size DESC LIMIT 1', [process.env.DB_NAME], (err, largestTableResult) => {
        if (!err && largestTableResult && largestTableResult[0]) {
          statusData.largestTable = `${largestTableResult[0].table_name} (${(largestTableResult[0].size / (1024 * 1024)).toFixed(2)} MB)`;
        }

        // Get the most recent table entry
        db.query('SELECT table_name, update_time FROM information_schema.tables WHERE table_schema = ? ORDER BY update_time DESC LIMIT 1', [process.env.DB_NAME], (err, recentEntryResult) => {
          if (!err && recentEntryResult && recentEntryResult[0]) {
            statusData.mostRecentEntry = `${recentEntryResult[0].table_name} (Last updated: ${recentEntryResult[0].update_time})`;
          }

          // Send the final status data as JSON response
          res.setHeader('Content-Type', 'application/json');
          return res.status(200).json(statusData); // This ensures valid JSON is sent
        });
      });
    });
  });
});
