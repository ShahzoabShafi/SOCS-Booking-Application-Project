// requirements
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbPromise = require('../config/db');




// these apis will control type 2 (group meeting) related actions according to the following routes:

//router.post("/group", propose_slots);
//router.post("/group/invite", invite);
//router.post("/group/:id/vote", vote);
//router.get("/group/votes", view_slot_votes);
//router.post("/group/:id/confirm", confirm_slot);




// propose_slots:
// goal is to allow a group owner to propose many slots for voting. All these slots are added to the slot table
// POST /api/slots/group
const propose_slots = async (req, res) => {

    const db = await dbPromise; 

    // 1. collect data
    const user_id = req.user.id; // thru JWT
    const slots = req.body.slots;
    // note that the user will not have to fill in each slots table field.
    // only start_time, end_time, and slot_title
    

    // 2. validation 
    for (const slot of slots){

        // check if start time is > end time
        if (slot.start_time >= slot.end_time){
            return res.status(400).json({ message: "End time must be later than start time." });
        }

        // There is no slot_type check since I don't make it part of the input. 
    }

    // 3. Insert the slots into the database
    try{
        for (const slot of slots){

            const insert_slot = await db.run(
                `INSERT INTO slots
                (user_id, slot_title, start_time, end_time, number_weeks_recurrence, status, slot_type, created_at)
                VALUES (?, ?, ?, ?, ?, 'private', 'group_meeting', CURRENT_TIMESTAMP)`,
                [user_id, slot.slot_title, slot.start_time, slot.end_time, slot.number_weeks_recurrence]);
       }
       // 4. Communicate success of insert or errors.
       return res.status(201).json({ message: "Slots created." });
    }
    catch (err){
        return res.status(500).json({message: "Inserting slots failed.", error: err.message});
    }
}





// this function allows an owner to generate a shareable URL invitation that allows users
// to view the owner's proposed slots. Likely will be called thru a "create invite" button.
// POST /api/slots/group/invite
const invite = async (req, res) => {

    const db = await dbPromise; 
    
    // collect id from JWT, not url parameter like previous version
    const owner_id = req.user.id;

    // this url (blah/booking/:owner) will the be used by a user thru a GET request, once owner shares the link with them.
    // Separating this into 2 apis allows the intention to share slot info to be clear and separate.
    const url = `${process.env.BASE_URL}/booking/${owner_id}`;
    return res.status(200).json({url});
}





// this function allows users to vote for a slot
// POST /api/slots/:id/vote
const vote = async (req, res) => {
    
    const db = await dbPromise; 

    // 1. collect data
    const user_id = req.user.id;
    const slot_id = req.body.slot_id;

    // 2. validate data
    // check slot exists
    const slot = await db.get(
        `SELECT * FROM slots WHERE slot_id = ?`, [slot_id]
    );

    if (!slot){
        return res.status(400).json({ message: "Chosen slot doesn't exist." });
    }

    // check user hasn't already voted for this slot
    const existing_vote = await db.get(
        `SELECT * FROM group_votes WHERE slot_id = ? and user_id = ?`, [slot_id, user_id]
    );

    if (existing_vote){
        return res.status(400).json({ message: "You already voted for that slot, and cannot vote again."});
    }
    
    // 3. Insert into group_votes
    try{
        const insert_vote = await db.run(
            `INSERT INTO group_votes
            (slot_id, user_id, created_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)`,
            [slot_id, user_id]);

        return res.status(201).json({ message: "Vote recorded successfully." }); 
    }

    catch (err){
        return res.status(500).json({ message: "Failed to insert vote into database." , error: err.message});
    }
}





// This function allows owners to view the votes for their proposed slots
// GET /api/slots/group/votes
const view_slot_votes = async (req, res) => {

    const db = await dbPromise; 

    // 1. get data
    const owner_id = req.user.id;
    
    // 2. validate data
    const owner = await db.get(
        `SELECT * FROM users
        WHERE user_id = ?`,
        [owner_id]
    );
    if (!owner || owner.role != 'owner'){
        return res.status(403).json({ message: "Unauthorized user." });
    }

    // 2. Retrieve votes
    try{
        const votes = await db.all(
            
            // The below sql query is ai-generated content. 
            `SELECT s.slot_id, s.slot_title, s.start_time, s.end_time, s.status,
             COUNT(gv.vote_id) AS vote_count
             FROM slots s
             LEFT JOIN group_votes gv ON s.slot_id = gv.slot_id
             WHERE s.user_id = ?
             AND s.slot_type = 'group_meeting'
             GROUP BY s.slot_id
             ORDER BY s.start_time ASC;`,
            // end of ai-generated content 
            [owner_id]);

        return res.status(200).json({ message: "Votes retrieved successfully.",
                                      slot_votes: votes});
    }
    catch (err){
        return res.status(500).json({ message: "Failed to retrieve vote counts.", error: err.message});
    }
}




// This function allows an owner to confirm a slot as the confirmed meeting time among those proposed.
// Bookings will be created for all parties involved.
// POST /api/slots/group/:id/confirm
const confirm_slot = async (req, res) => {

    const db = await dbPromise; 

    // 1. Collect data
    const owner_id = req.user.id;
    const slot_id = req.params.id; 
    
    
    // 2. Validate data
    const slot = await db.get(
    `SELECT * FROM slots 
    WHERE slot_id = ? AND user_id = ? AND slot_type = 'group_meeting'`,
    [slot_id, owner_id]
    );

    if (!slot) {
        return res.status(403).json({ message: "Provided slot is invalid: make sure it is a group meeting type slot that you own." });
    }
 

    // 3. Create bookings and modify slots to set them to private
    
    // Which users do we need to create it for?
    // ... those users who voted for the chosen slot...
    // what about the other that voted from that invitation link? Are they just left in the dark as to what happened?
    // idk how to handle that since there is no id to gather together all the proposed slots. Assume not needed.
    
    const users_of_chosen_slot = await db.all(
        `SELECT DISTINCT user_id FROM group_votes WHERE slot_id = ?`, // distinct shouldn't technically be needed.
        [slot_id]
    );

    try{
        // create it for the owner
        const owner_booking = await db.run(
            `
            INSERT INTO bookings (slot_id, user_id, created_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            `,
            [slot_id, owner_id]
        );

        // create them for the users
        for (const user of users_of_chosen_slot){
            const user_booking = await db.run(
                `
                INSERT INTO bookings (slot_id, user_id, created_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
                `,
                [slot_id, user.user_id]
            );
        }


        // set all the proposed slots to private
        // only way to set them all is to query all slots with same title and owner and slot_type
        const slot_status_update = db.run(
            `UPDATE slots 
            SET status = 'private'
            WHERE title = ?, user_id = ?, slot_type = 'group_meeting'
            `,
            [slot.title, owner_id]
        );
        
        return res.status(200).json({ message: "Bookings all created successfully for slot owner and associated users." });
    }
    catch (err){
        return res.status(500).json({ message: "Failed to create the bookings for owner and associated users." });
    }
}



// be free my functions!!!
module.exports = {propose_slots, invite, vote, view_slot_votes, confirm_slot};
