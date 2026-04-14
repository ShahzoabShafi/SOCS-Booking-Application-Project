// connect to db and recieve request
const dbPromise = require('../config/db');

// link for this function will be (get) /api/confirmedBookings
// this function allows any user to view all confirmed booking requests aimed at them.
const confirmed_bookings = async (req, res) =>{

    // new db config requires this approach
    const db = await dbPromise;

    // 1. collect data
    // all we need is the user_id of the owner, which is given 
    const user_id = req.user.id; // thru JWT

    // 2. validation - not needed since there's no actual input. 

    // 3. Obtain the confirmed bookings associated to this owner thru the db
    // get confirmed bookings associated to this owner, and also retrieve details about the person they're meeting with.
    // the latter part can only be done slightly convolutedly - we look for the other (should be only one) booking that
    // has the same slot_id, and use that slot_id as a bridge through slots to ther users table.
    const confirmed_bookings_info = await db.all(
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
    // note returning an empty array is ok / thats what we want. (?) (talk to frontend)
    return res.status(200).json({ message: "Bookings retrieved successfully!",
                                  all_confirmed_bookings: confirmed_bookings_info});
};

module.exports = {confirmed_bookings};
