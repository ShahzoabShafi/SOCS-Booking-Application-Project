const dbPromise = require('../config/db');


// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {

  // new version of db setup
  const db = await dbPromise;



  try {
    // Promisify db.get and db.all
    const dbGet = (query, params) => {
      return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });
    };

    const dbAll = (query, params) => {
      return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        });
      });
    };

    // Get user info
    const user = await dbGet('SELECT user_id, name, email, role FROM users WHERE user_id = ?', [req.user.id]);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get user bookings
    const bookings = await dbAll('SELECT * FROM bookings WHERE user_id = ?', [req.user.id]);

    // Get user owned slots if the user is an owner
    let ownedSlots = [];
    if (user.role === 'owner') {
      ownedSlots = await dbAll('SELECT * FROM slots WHERE owner_id = ?', [req.user.id]);
    }

    // Get user managed slots if the user is a manager
    let managedSlots = [];
    if (user.role === 'manager') {
      managedSlots = await dbAll('SELECT * FROM slots WHERE manager_id = ?', [req.user.id]);
    }

    res.json({
      user,
      bookings,
      ownedSlots,
      managedSlots,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error: ', error);
  }
};

module.exports = {
  getDashboardData,
};
