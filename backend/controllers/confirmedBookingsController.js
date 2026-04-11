// connect to db and recieve request
const dbPromise = require('../config/db');

// link for this function will be (get) /api/confirmedBookings
// this function allows any user to view all booking requests aimed at them.
const confirmed_bookings = async (req, res) =>{

    // new db config requires this approach
    const db = await dbPromise;

    // 1. collect data
    // all we need is the user_id of the owner, which is given 
    const user_id = req.user.id; // thru JWT

    // 2. validation - not needed since there's no actual input. 

    // 3. Obtain the confirmed bookings associated to this owner thru the db
    const bookings = await db.all(
        `SELECT b.created_at_date AS booking_created_at, s.slot_title, s.start_time, s.end_time, s.slot_type
        FROM bookings b
        JOIN slots s ON b.slot_id = s.slot_id
        WHERE b.user_id = ? 
        ORDER BY booking_created_at ASC;`,
        [user_id]
    );

    // 4. return crap
    // note returning an empty array is ok / thats what we want. (?) (talk to frontend)
    return res.status(200).json({ message: "Bookings retrieved successfully!",
                                  all_confirmed_bookings: bookings });
};

module.exports = {confirmed_bookings};
