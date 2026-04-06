const pool = require('../config/db');

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const client = await pool.connect();

    // Get user info
    const userResult = await client.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    // Get user bookings
    const bookingsResult = await client.query('SELECT * FROM bookings WHERE user_id = $1', [req.user.id]);
    const bookings = bookingsResult.rows;

    // Get user owned slots if the user is an owner
    let ownedSlots = [];
    if (user.role === 'owner') {
      const ownedSlotsResult = await client.query('SELECT * FROM slots WHERE owner_id = $1', [req.user.id]);
      ownedSlots = ownedSlotsResult.rows;
    }

    client.release();

    res.json({
      user,
      bookings,
      ownedSlots,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardData,
};
