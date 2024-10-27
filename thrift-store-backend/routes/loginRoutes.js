const express = require('express');
const { registerVendor, vendorLogin, vendorLogout } = require('../controllers/loginController');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
  });

// Route to register a new vendor
router.post('/register', registerVendor);

// Route for vendor login
router.post('/login', loginRateLimiter, vendorLogin);

// Route for vendor logout
router.post('/logout', vendorLogout);

module.exports = router;
