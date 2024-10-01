require('dotenv').config();
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const morgan = require('morgan');
const { db, query } = require('./config/db'); // Import db and query
const express = require('express');
const fs = require('fs');
const { promisify } = require('util');

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));
app.use(morgan('dev'));

// Serve images and videos with correct MIME types
app.get('/downloads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'downloads', req.params.filename);
  const fileExtension = path.extname(filePath).toLowerCase();

  let contentType = 'application/octet-stream'; // Default MIME type
  if (fileExtension === '.mp4') {
    contentType = 'video/mp4';
  } else if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
    contentType = 'image/jpeg';
  } else if (fileExtension === '.png') {
    contentType = 'image/png';
  }

  fs.exists(filePath, (exists) => {
    if (exists) {
      res.setHeader('Content-Type', contentType);
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });
});

// Serve image files from the "downloads/photos" directory
app.get('/downloads/photos/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'downloads/photos', req.params.filename);
  const fileExtension = path.extname(filePath).toLowerCase();

  let contentType = 'application/octet-stream'; // Default MIME type
  if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
    contentType = 'image/jpeg';
  } else if (fileExtension === '.png') {
    contentType = 'image/png';
  }

  // Check if file exists and serve it with the correct MIME type
  fs.exists(filePath, (exists) => {
    if (exists) {
      res.setHeader('Content-Type', contentType);
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });
});

// Metrics endpoint to serve metrics.json
app.get('/api/metrics', (req, res) => {
  const metricsFilePath = path.join(__dirname, 'metrics/metrics.json');

  fs.readFile(metricsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading metrics file:', err); // More detailed error logging
      return res.status(500).json({ error: 'Failed to read metrics file' });
    }

    try {
      const metrics = JSON.parse(data);
      res.json({
        totalPostsScraped: metrics.total_posts_scraped || 0,
        totalVendorsScraped: metrics.total_vendors_scraped || 0,
        lastScrapeTime: metrics.end_time || '',
        averagePostsPerVendor: metrics.total_vendors_scraped 
          ? (metrics.total_posts_scraped / metrics.total_vendors_scraped).toFixed(2) 
          : 0,
        errorsDuringScraping: metrics.errors_encountered || 0,
        totalTimeToComplete: metrics.total_time_to_complete || 0,
        numberOfPostsDownloaded: metrics.number_of_posts_downloaded || 0,
        scrapingSuccessRate: metrics.scraping_success_rate || 0,
        vendorWithMaxPosts: metrics.vendor_with_max_posts || { name: 'Unknown', total_posts: 0 },
        lastScrapingError: metrics.last_scraping_error || 'None'
      });
    } catch (parseError) {
      console.error('Error parsing metrics file:', parseError); // Log parse error
      res.status(500).json({ error: 'Failed to parse metrics file' });
    }
  });
});

// Routes
const vendorRoutes = require('./routes/vendorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const blogRoutes = require('./routes/blogRoutes');
const guestRoutes = require('./routes/guestRoutes');
const statusRoutes = require('./routes/statusRoutes');
const instagramRoutes = require('./routes/instagramRoutes');

// Route integrations
app.use('/api', vendorRoutes);
app.use('/api', eventRoutes);
app.use('/api', blogRoutes);
app.use('/api', guestRoutes);
app.use('/api', statusRoutes);
app.use('/api/instagram', instagramRoutes);

// Instagram Route (Ensure `fetchVendorInstagramPosts` is defined and imported)
// Instagram Route: Fetch Instagram posts for selected vendors (callback-based)
app.get('/api/vendors-instagram-posts', (req, res) => {
  const { selectedVendors } = req.query;

  if (!selectedVendors || selectedVendors.length === 0) {
    return res.json([]); // Return an empty array if no vendors are selected
  }

  const vendorIds = selectedVendors.split(',').map(id => parseInt(id, 10));

  // Use callback-based query for consistency
  db.query(
    'SELECT id, name, instagram_username FROM vendorshops WHERE id IN (?) AND instagram_username IS NOT NULL AND instagram_username != ""',
    [vendorIds],
    (err, vendors) => {
      if (err) {
        console.error('Error fetching vendors:', err);
        return res.status(500).json({ message: 'Error fetching vendors' });
      }

      const vendorPostsPromises = vendors.map((vendor) => {
        return new Promise((resolve, reject) => {
          fetchVendorInstagramPosts(vendor.instagram_username)
            .then((posts) => {
              resolve({
                vendor: vendor.name,
                posts: posts || [],
              });
            })
            .catch((error) => {
              console.error('Error fetching Instagram posts:', error);
              reject({ vendor: vendor.name, posts: [] });
            });
        });
      });

      // Handle all promises
      Promise.all(vendorPostsPromises)
        .then((vendorPosts) => res.json(vendorPosts))
        .catch((error) => {
          console.error('Error in vendor posts promises:', error);
          res.status(500).json({ message: 'Error fetching vendor Instagram posts' });
        });
    }
  );
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

    db.query('SELECT SUM(data_length + index_length) AS size FROM information_schema.tables WHERE table_schema = ?', [process.env.DB_NAME], (err, result) => {
      if (err || !result[0]) {
        return res.status(500).json({ error: 'Failed to retrieve database size' });
      }
      statusData.dbSize = `${(result[0].size / (1024 * 1024)).toFixed(2)} MB`;

      db.query('SELECT table_name, data_length + index_length AS size FROM information_schema.tables WHERE table_schema = ? ORDER BY size DESC LIMIT 1', [process.env.DB_NAME], (err, largestTableResult) => {
        if (err || !largestTableResult[0]) {
          return res.status(500).json({ error: 'Failed to retrieve largest table' });
        }
        statusData.largestTable = `${largestTableResult[0].table_name} (${(largestTableResult[0].size / (1024 * 1024)).toFixed(2)} MB)`;

        db.query('SELECT table_name, update_time FROM information_schema.tables WHERE table_schema = ? ORDER BY update_time DESC LIMIT 1', [process.env.DB_NAME], (err, recentEntryResult) => {
          if (err || !recentEntryResult[0]) {
            return res.status(500).json({ error: 'Failed to retrieve recent entry' });
          }
          statusData.mostRecentEntry = `${recentEntryResult[0].table_name} (Last updated: ${recentEntryResult[0].update_time})`;
          res.json(statusData);
        });
      });
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
