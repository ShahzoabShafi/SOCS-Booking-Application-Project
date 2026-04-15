const dbPromise = require('../config/db');

// server.js will parse the request body, which could be either JSON or URL-encoded.
const request_booking = async (req, res) =>{ 

    // new db config requires this approach
    const db = await dbPromise;

    // 2. collect data
    const user_id = req.user.id; // uses JWT to get user_id
    const owner_email = req.body.owner_email; // to replace previous erroneous owner_id that users can't provide.
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    const title = req.body.title;
    const message = req.body.message;

    // 3. input validation
    
    // !... in js checks for falsy, ie either false, 0, underfined, null, etc.
    if (!owner_email || !start_time || !end_time || !title || !message){
        // return bad request error
        return res.status(400).json({ message: "Required field(s) missing."});
    }
    
    // validate submitted times
    start = new Date(start_time)
    end = new Date(end_time)
    if (start >= end){
        return res.status(400).json({ message: "End time must be later than start time."});
    }
    
    // validate owner
    const owner = await db.get(
        "SELECT email, role, user_id FROM users where email = ?",
        [owner_email]);
    
    if (!owner) {
        return res.status(404).json({ message: "Provided user to meet with was not found."});
    }
    
    if (owner.role != "owner"){
        return res.status(400).json({ message: "Provided user to meet with is not of type owner."});
    }
    

    // 4. Insert the meeting request into meeting_requests
    const database_insert = await db.run(
        `INSERT INTO meeting_requests 
        (user_id, owner_id, start_time, end_time, title, message, request_status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)`,
        [user_id, owner.user_id, start_time, end_time, title, message]);

    
    // 5. communicate success of insert
    // I don't think we need to catch error here. we validated input so insert should work. 
    return res.status(201).json({ message: "Booking request created successfully."});
}

const cancelBooking = async (req, res) => {
    try {
        const db = await dbPromise;
        const booking_id = req.params.id;
        const user_id = req.user.id;

        const booking = await db.get('SELECT * FROM bookings WHERE booking_id = ?', [booking_id]);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user_id !== user_id) {
            return res.status(403).json({ message: 'You can only cancel your own bookings' });
        }

        await db.run('DELETE FROM bookings WHERE booking_id = ?', [booking_id]);

        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {request_booking, cancelBooking};
