const dbPromise = require('../config/db');


// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  const db = await dbPromise;

  try {
    const user = await db.get(
      'SELECT user_id, name, email, role FROM users WHERE user_id = ?', 
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookings = await db.all(
      'SELECT * FROM bookings WHERE user_id = ?', 
      [req.user.id]
    );

    let ownedSlots = [];
    if (user.role === 'owner') {
      ownedSlots = await db.all(
        'SELECT * FROM slots WHERE user_id = ?', 
        [req.user.id]
      );
    }

    res.json({ user, bookings, ownedSlots });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error: ', error });
  }
};

module.exports = {
  getDashboardData,
};
