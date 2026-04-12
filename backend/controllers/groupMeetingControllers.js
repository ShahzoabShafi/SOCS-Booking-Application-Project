// requirements
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbPromise = require('../config/db');


// these apis will control type 2 (group meeting) related actions according to the following routes:

//router.post("/group", propose_slots);
//router.post("/group/:id/invite", invite);
//router.post("/group/:id/vote", vote);
//router.get("/group/:ownerId/votes", view_slot_votes);
//router.post("/group/:id/confirm", confirm_slot);


// propose_slots:
// goal is to allow a group owner to select many slots
const propose_slots = async (req, res) => {

    // new db config requires this approach
    const db = await dbPromise;

    // 1. collect data
    // all we need is the user_id of the owner, which is given 
    const user_id = req.user.id; // thru JWT

    // 2. validation - not needed since there's no actual input. 

    // 3. Obtain the confirmed bookings associated to this owner thru the db
    const bookings = await db.all(
        `SELECT b.created_at AS booking_created_at, s.slot_title, s.start_time, s.end_time, s.slot_type
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
    
}


const invite = async (req, res) => {
    
}


const vote = async (req, res) => {
    
}


const view_slot_votes = async (req, res) => {
    
}


const confirm_slot = async (req, res) => {
    
}


module.exports = {propose_slots, invite, vote, view_slot_votes, confirm_slot};
