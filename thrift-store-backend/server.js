const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Optional logging middleware
require('dotenv').config();

const vendorRoutes = require('./routes/vendorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const blogRoutes = require('./routes/blogRoutes');
const guestRoutes = require('./routes/guestRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies (if needed)
app.use(express.static('public')); // Serves static files from the 'public' directory
app.use('/uploads', express.static('uploads')); // Serves static files from the 'uploads' directory

// Optional: Add logging middleware
app.use(morgan('dev'));

// Route integrations
app.use('/api', vendorRoutes);
app.use('/api', eventRoutes);
app.use('/api', blogRoutes);
app.use('/api', guestRoutes);

// Error handling middleware (optional but recommended)
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
