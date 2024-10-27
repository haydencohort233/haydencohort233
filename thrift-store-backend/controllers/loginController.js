const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const axios = require('axios');
require('dotenv').config();

const saltRounds = 10;

const logAction = async (logType, message) => {
  try {
    await axios.post('http://localhost:5000/api/logs/log-action', {
      logType,
      message,
    });
  } catch (error) {
    console.error(`Failed to log action: ${message}. Error: ${error.message}`);
  }
};

exports.registerVendor = async (req, res) => {
  const { username, password, vendorId } = req.body;

  try {
    const existingUser = await query('SELECT * FROM login_vendors WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertQuery = 'INSERT INTO login_vendors (username, password_hash, vendor_id) VALUES (?, ?, ?)';
    await query(insertQuery, [username, hashedPassword, vendorId]);

    await logAction('vendor', `${username} registered successfully.`);
    res.status(201).json({ message: 'Vendor registered successfully' });
  } catch (error) {
    await logAction('error', `Error registering vendor: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.vendorLogin = async (req, res) => {
  const { username, password } = req.body;
  console.log('Vendor login attempt:', { username });

  try {
    const userResult = await query('SELECT * FROM login_vendors WHERE username = ?', [username]);
    console.log('Query result for user:', userResult);

    if (userResult.length === 0) {
      console.log('User not found in database.');
      await logAction('vendor', `${username} attempted to login but was not found`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = userResult[0];

    // Verify if password is expired
    const now = new Date();
    console.log('Password expiration date:', user.password_expires);
    if (new Date(user.password_expires) <= now) {
      console.log('Password has expired for user:', username);
      await logAction('vendor', `${username} attempted to login with expired password`);
      return res.status(403).json({ error: 'Password has expired. Please reset your password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    console.log('Password match result:', passwordMatch);
    if (!passwordMatch) {
      console.log('Password does not match.');
      await logAction('vendor', `${username} attempted to login with incorrect password`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create a JWT token for authenticated access
    const token = jwt.sign(
      { userId: user.id, vendorId: user.vendor_id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log('JWT token generated.');

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    console.log('Login successful, sending response.');
    await logAction('vendor', `${username} has logged in successfully`);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    await logAction('error', `Error during vendor login: ${error.message}`);
    console.error('Error during vendor login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.vendorLogout = async (req, res) => {
  const username = req.body.username;

  if (!username) {
    await logAction('error', `Attempted logout with missing username.`);
    console.error("No username provided in logout request.");
    return res.status(400).json({ error: 'Username is required for logout' });
  }

  try {
    // Log using the centralized log-action API
    await logAction('vendor', `${username} has logged out successfully`);

    // Clear the authentication token
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    await logAction('error', `Error during vendor logout for user ${username}: ${error.message}`);
    console.error('Error during vendor logout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
