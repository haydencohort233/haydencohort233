require('dotenv').config();
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const morgan = require('morgan');
const db = require('./config/db');
const express = require('express');
const fs = require('fs');
const { promisify } = require('util');

const app = express();
const PORT = process.env.PORT || 5000;
const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

// Promisify db.query for easier async/await usage
const query = promisify(db.query).bind(db);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Ensure this matches the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Admin-Username', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
// Serve the 'downloads' directory for image files
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));
app.use(morgan('dev'));

// Serve images and videos with correct MIME types
app.get('/downloads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'downloads', req.params.filename);
  const fileExtension = path.extname(filePath).toLowerCase();

  // Determine the correct MIME type for the file
  let contentType = 'application/octet-stream'; // Default MIME type
  if (fileExtension === '.mp4') {
    contentType = 'video/mp4';
  } else if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
    contentType = 'image/jpeg';
  } else if (fileExtension === '.png') {
    contentType = 'image/png';
  }

  // Check if the file exists and serve it with the correct MIME type
  fs.exists(filePath, (exists) => {
    if (exists) {
      res.setHeader('Content-Type', contentType);
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });
});

// Routes
const vendorRoutes = require('./routes/vendorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const blogRoutes = require('./routes/blogRoutes');
const guestRoutes = require('./routes/guestRoutes');
const statusRoutes = require('./routes/statusRoutes');

// Route integrations
app.use('/api', vendorRoutes);
app.use('/api', eventRoutes);
app.use('/api', blogRoutes);
app.use('/api', guestRoutes);
app.use('/api', statusRoutes);

// Instagram Route
app.get('/api/vendors-instagram-posts', async (req, res) => {
  const { selectedVendors } = req.query;

  if (!selectedVendors || selectedVendors.length === 0) {
    return res.json([]); // Return an empty array if no vendors are selected
  }

  const vendorIds = selectedVendors.split(',').map(id => parseInt(id, 10));

  try {
    // Use the promisified query function
    const vendors = await query(
      'SELECT id, name, instagram FROM vendorshops WHERE id IN (?) AND instagram IS NOT NULL AND instagram != ""',
      [vendorIds]
    );

    const vendorPostsPromises = vendors.map(async (vendor) => {
      const posts = await fetchVendorInstagramPosts(vendor.instagram); // Ensure this function is correctly defined
      return {
        vendor: vendor.name,
        posts: posts || [],
      };
    });

    const vendorPosts = await Promise.all(vendorPostsPromises);
    res.json(vendorPosts);
  } catch (error) {
    console.error('Error fetching vendor Instagram posts:', error);
    res.status(500).json({ message: 'Error fetching vendor Instagram posts' });
  }
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

  db.ping((err) => {
    if (err) {
      return res.status(200).json(statusData);
    }

    statusData.dbStatus = true;

    query('SELECT SUM(data_length + index_length) AS size FROM information_schema.tables WHERE table_schema = ?', [process.env.DB_NAME])
      .then(result => {
        if (result && result[0]) {
          statusData.dbSize = `${(result[0].size / (1024 * 1024)).toFixed(2)} MB`;
        }
        return query('SELECT table_name, data_length + index_length AS size FROM information_schema.tables WHERE table_schema = ? ORDER BY size DESC LIMIT 1', [process.env.DB_NAME]);
      })
      .then(largestTableResult => {
        if (largestTableResult && largestTableResult[0]) {
          statusData.largestTable = `${largestTableResult[0].table_name} (${(largestTableResult[0].size / (1024 * 1024)).toFixed(2)} MB)`;
        }
        return query('SELECT table_name, update_time FROM information_schema.tables WHERE table_schema = ? ORDER BY update_time DESC LIMIT 1', [process.env.DB_NAME]);
      })
      .then(recentEntryResult => {
        if (recentEntryResult && recentEntryResult[0]) {
          statusData.mostRecentEntry = `${recentEntryResult[0].table_name} (Last updated: ${recentEntryResult[0].update_time})`;
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(statusData);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve database status' });
      });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Serve the privacy policy file
app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});

// Handle all other routes with the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
