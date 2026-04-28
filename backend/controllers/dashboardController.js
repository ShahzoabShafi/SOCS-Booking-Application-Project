// Shahzoab Shafi
const dbPromise = require('../config/db');

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
      `
      SELECT

      b.created_at AS booking_created_at, b.booking_id,
      s.slot_title, s.start_time, s.end_time, s.slot_type,
      u.email AS meeting_partner_email, u.name AS meeting_partner_name

      FROM bookings b
      JOIN slots s ON b.slot_id = s.slot_id
      JOIN bookings b2 ON b2.slot_id = b.slot_id AND b2.user_id != ?
      JOIN users u ON b2.user_id = u.user_id
      WHERE b.user_id = ?

      ORDER BY booking_created_at ASC;
      `,
      [user_id, user_id]
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
