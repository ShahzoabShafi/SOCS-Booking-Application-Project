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







/// the below delete functions were old news. shahzoab merged some of this into his cancel booking function. 


//
//// this function will allow an owner to delete a booking.
//// api call will be (delete) /api/confirmedBookings/delete
//
//const owner_deletes_booking = async (req, res) => {
//    
//    // new db config requires this approach
//    const db = await dbPromise;
//
//    // 1. get data
//    const owner_id = req.user.id;
//    const booking_id = req.body.booking_id;
//
//
//    // 2. validate data
//   
//    // is user actually an owner?
//    const owner_role = await db.get(
//        `SELECT role FROM users u WHERE u.user_id = ?`,
//        [owner_id]
//    );
//    if (!owner_role || owner_role.role !== "owner"){ // not sure which is needed.
//        return res.status(403).json({ message: "User is calling an owner-only function." });
//    }
//
//    // is they actually booked to that booking id?
//    const booking = await db.get(
//        `SELECT * FROM bookings b WHERE b.booking_id= ? AND b.user_id = ?`,
//        [booking_id, owner_id]
//    );
//
//    if (!booking){
//        return res.status(404).json({ message: "No booking associated to you and the slot indicated." });
//    }
//
//    // 3. Perform the deletion 
//    // When an OWNER deletes a booking, the associated slot is NOT deleted.
//    // We need the booking partner's email
//    const return_info = await db.all(
//        `
//        SELECT u.email
//
//        FROM bookings b
//        JOIN users u ON u.user_id = b.user_id 
//        WHERE b.slot_id = (
//            SELECT slot_id FROM bookings WHERE booking_id = ?
//        )
//        AND b.user_id != ?`,
//        [booking_id, owner_id] 
//    );
//    
//    // get slot id
//    const slot = await db.get(
//        `SELECT * FROM bookings WHERE booking_id = ?`,
//        [booking_id]
//    );
//    const slot_id = slot.slot_id;
//
//    try {
//        const deletion = await db.run(
//            `DELETE FROM bookings WHERE slot_id = ?`,
//            [slot_id] // deletes all associated bookings.
//        );
//    }
//    catch (err) {
//        console.error(err);
//        return res.status(500).json( { message: "Deletion failed." });
//    }
//    
//    return res.status(200).json({ message: "Booking deleted successfully. The associated slot still exists, with status 'private'.",
//                                  cancellation_info: return_info});
//}
//
//
//
//
//
//
//const user_deletes_booking = async(req,res) => {
// 
//    // new db config requires this approach
//    const db = await dbPromise;
//
//    // 1. Get data
//    const user_id = req.user.id
//    const booking_id = req.body.booking_id
//
//    // 2. validate data
//
//    // is user actually of user type?
//    const user_role = await db.get(
//        `SELECT role FROM users u WHERE u.user_id = ?`,
//        [user_id]
//    );
//    if (!user_role || user_role.role !== "user"){ // not sure which is needed.
//        return res.status(403).json({ message: "User calling this function must be of type user." });
//    }
//
//    // is they actually booked to that booking id?
//    const booking = await db.get(
//        `SELECT * FROM bookings b WHERE b.booking_id= ? AND b.user_id = ?`,
//        [booking_id, user_id]
//    );
//
//    if (!booking){
//        return res.status(404).json({ message: "No booking associated to this user and the slot indicated." });
//    }
//
//    // 3. Perform the deletion
//    
//    try {
//        const booking_deletion = await db.run(
//            `DELETE FROM bookings WHERE slot_id = ?`,
//            [slot_id] // deletes all associated bookings.
//        );
//
//        const slot_deletion = await db.run(
//            `DELETE FROM slots WHERE slot_id = ?`.
//            [booking.slot_id]
//        );
//    }
//    catch (err) {
//        console.error(err);
//        return res.status(500).json( { message: "Deletion failed." });
//    }
//    
//    return res.status(200).json({ message: "Booking deleted successfully. The associated slot still exists, with status 'private'.",
//                                  cancellation_info: return_info});
//
//}
//
//
//
//
//
//
//
//module.exports = {confirmed_bookings, delete_booking};
