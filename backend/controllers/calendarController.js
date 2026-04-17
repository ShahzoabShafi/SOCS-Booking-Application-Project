// connect to db and recieve request
const dbPromise = require('../config/db');

// link for this function will be (get) /api/calendar/export
// this function allows any user to view all confirmed booking requests aimed at them.
const export_calendar = async (req, res) =>{

    // new db config requires this approach
    const db = await dbPromise;

    // 1. collect data

    // 2. validation 

    // 3. Obtain the info
   
    try{
        const blah = await db.all(
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

        // 4. return crap
        return res.status(200).json({ message: "Bookings retrieved successfully!",
                                      all_confirmed_bookings: confirmed_bookings_info});
    }
    catch (err) {
        return res.status(403).json({ message: "Failed to do crap.",
                                      error: err.message });
    }
};

module.exports = {export_calendar};
