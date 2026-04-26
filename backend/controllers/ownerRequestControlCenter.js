// connect to db and recieve request
const dbPromise = require('../config/db');
const { sendEmail } = require('../utils/emailService');

// link for this function will be (get) /api/bookings/requests
// first function allows owner-type-users to view all booking requests aimed at them.
const get_requests = async (req, res) => {

    // new db config requires this approach
    const db = await dbPromise;

    // 1. collect data
    // all we need is the user_id of the owner, which is given 
    const owner_id = req.user.id; // thru JWT

    // 2. validation - may not be needed since there's no actual input. 
    // is the user truly an owner?
    const owner = await db.get(
        "SELECT user_id, role FROM users WHERE user_id = ?",
        [owner_id]);

    if (!owner) {
        return res.status(404).json({ message: "Not an existing user." }); // how could this be possible? Anyway its safe
    }

    if (owner.role != "owner") {
        return res.status(403).json({ message: "Only users of type owner can view booking requests destined to them." });
    }

    // 3. Obtain the meeting requests associated to this owner thru the db
    const meeting_requests = await db.all(
        `SELECT mr.request_id, mr.start_time, mr.end_time, mr.title, mr.message, mr.request_status, mr.created_at AS request_created_at, u.name, u.email
        FROM meeting_requests mr
        JOIN users u ON mr.user_id = u.user_id
        WHERE mr.owner_id = ? AND mr.request_status = 'pending' ORDER BY request_created_at ASC;`, // getting some useful info from users too.
        [owner_id]
    );

    // 4. return crap
    // note returning an empty array is ok / thats what we want. (?) (talk to frontend)
    return res.status(200).json({ pending_requests: meeting_requests });
};



// link for this function will be (put) /api/bookings/requests/:id
// second function allows owner-type-user to handle a request (ie accept or decline).
const update_request = async (req, res) => {

    // new db config requires this approach
    const db = await dbPromise;


    // 1. collect data
    const request_id = req.body.request_id;
    const status = req.body.status;
    const owner_id = req.user.id;
    const owner = await db.get(
        "SELECT * FROM users WHERE user_id = ?",
        [owner_id]);
    const request = await db.get(
        "SELECT * FROM meeting_requests WHERE request_id = ? AND owner_id = ?",
        [request_id, owner_id]);
    const user_email = await db.get(
        `SELECT email FROM users WHERE user_id == ?`,
        [request.user_id]
    );

    // 2. validation

    // the following shouldnt be possible if we get input from owner clicking on requests that exist. Assuming thats the frontend approach.
    if (!request) {
        return res.status(404).json({ message: "Not an existing booking request." });
    }

    // the status
    if (status != "accepted" && status != "declined") {
        return res.status(400).json({ message: "Invalid booking request status update. Must be either 'accepted' or 'declined'." });
    }

    // 3. update the status of the booking based on input.
    const modify_request = await db.run(
        `UPDATE meeting_requests
        SET request_status = ?
        WHERE request_id = ?`,
        [status, request_id]);

    // 4. Add this confirmed bookings to the bookings table in the db
    if (status == "accepted") {

        // before we create a booking we must create a slot - this hasn't been done yet
        const insert_slot = await db.run( // note db.run returns object with the last id inserted.
            `INSERT INTO slots
            (user_id, slot_title, start_time, end_time, number_weeks_recurrence, status, slot_type, created_at)
            VALUES (?, ?, ?, ?, 1, 'private', 'request_meeting', CURRENT_TIMESTAMP)`,
            [owner_id, request.title, request.start_time, request.end_time]); // added as private since should not be visible to students.

        const slot_id = insert_slot.lastID;

        // first insert it with the owner id
        await db.run(
            `INSERT INTO bookings (slot_id, user_id, created_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)`,
            [slot_id, owner_id]
        );

        // then insert it with the user id
        await db.run(
            `INSERT INTO bookings (slot_id, user_id, created_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)`,
            [slot_id, request.user_id]
        );

        // send an email to the student that request is accepted
        const subject = 'Meeting Request Accepted';
        const text = 'Your meeting request has been accepted by professor ' + owner.name;
        await sendEmail(user_email.email, subject, text);
    } else {
        // send an email to the student that request is declined
        const subject = 'Meeting Request Declined';
        const text = 'Your meeting request has been declined by professor ' + owner.name;
        await sendEmail(owner.email, subject, text);
    }


    return res.status(200).json({
        email: user_email,
        message: "Request updated successfully."
    });
};

module.exports = { get_requests, update_request };
