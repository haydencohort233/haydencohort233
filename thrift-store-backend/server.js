const express = require('express');
const cors = require('cors');
require('dotenv').config();

const vendorRoutes = require('./routes/vendorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Parses incoming JSON
app.use(express.static('public')); // Serves static files from the 'public' directory
app.use('/uploads', express.static('uploads')); // Serves static files from the 'uploads' directory

app.use('/api', vendorRoutes);
app.use('/api', eventRoutes);
app.use('/api', blogRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
