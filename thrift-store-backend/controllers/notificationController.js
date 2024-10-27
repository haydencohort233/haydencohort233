const db = require('../config/db'); // Adjust as needed to match your DB configuration

const getNotifications = async (req, res) => {
  try {
    const currentDateTime = new Date();
    const [rows] = await db.query(`
      SELECT * FROM notifications
      WHERE show_on <= ? AND expires_at >= ?
    `, [currentDateTime, currentDateTime]);

    res.json(rows || []); // Return an empty array if there are no rows
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

module.exports = { getNotifications };
