// Connect to db and recieve request, which is recieved and parsed (JSON or urlencoded) by server.js
const db = require('../config/db');



// first function allows owner to create a new slot.
// link for this is (put) /api/slots/create
const create_slot = async (req, res) =>{

    // 1. input data
    const user_id = req.user.id; // uses JWT
    const slot_title = req.body.slot_title;
    const start_time = req.body.start_time;
    const end_time = req.body.end_time;
    const number_weeks_recurrence = req.body.number_weeks_recurrence; // assume defaulting to 1 is done on the frontend side
    const slot_type = req.body.slot_type;
    

    // 2. validation
    const start = new Date(start_time);
    const end = new Date(end_time);
    if (start >= end){
        return res.status(400).json({ message: "End time must be later than start time." });
    }

    if (number_weeks_recurrence < 0){
        return res.status(400).json({ message: "Invalid number of weeks recurrence." });
    }

    // this is where we see our slot creation approach is maybe too simple... 
    // do we need different functions for all three methods...
    if (slot_type != "request_meeting" && slot_type != "group_meeting" && slot_type != "office_hours"){
        return res.status(400).json({ message: "Invalid slot type" });
    }
   

    // 3. Insert a new slot into the database
    const insert_slot = await db.run(
        `INSERT INTO slots
        (user_id, slot_title, start_time, end_time, number_weeks_recurrence, status, slot_type, created_at)
        VALUES (?, ?, ?, ?, ?, 'private', ?, CURRENT_TIMESTAMP)`,
        [user_id, slot_title, start_time, end_time, number_weeks_recurrence, slot_type]);


    // 4. Communicate success of insert
    return res.status(201).json({ message: "Slot created." }); 
}





// second function aims to activate a slot to make it public
// link for this is (put) /api/slots/:id/activate
const activate_slot = async (req, res) =>{

    // 1. Get data
    const slot_id = req.body.slot_id;
    const owner_id = req.user.id;

    // 2. Validate data
    const slot = await db.get(
        `SELECT * FROM slots WHERE slot_id = ? AND user_id = ?`,
        [slot_id, owner_id]);

    if (!slot){
        return res.status(404).json({ message: "Slot doesn't exist." });
    }

    if (slot.status == 'active'){
        return res.status(400).json({ message: "Slot is already active." });
    }

    // 3. Update the status
    const update_status = await db.run(
        `UPDATE slots SET status = 'active' WHERE slot_id = ?`,
        [slot_id]);

    // 4. Notify of successful change
    return res.status(200).json({ message: "Status updated successfully." });
};





// third function deletes a slot.
// link for this is (delete) /api/slots/:id/delete
const delete_slot = async (req, res) =>{

    // 1. Get data
    const slot_id = req.body.slot_id;
    const user_id = req.user.id;

    // 2. validate data
    const slot = await db.get(
        `SELECT * FROM slots WHERE slot_id = ? AND user_id= ?`,
        [slot_id, user_id]);
    
    if (!slot){
        return res.status(404).json({ message: "Slot doesn't exist." });
    }

    // 3. Delete the slot 
    const delete_status = await db.run(
        `DELETE FROM slots WHERE slot_id = ?`,
        [slot_id]);
    
    // 4. Notify of successful change
    return res.status(200).json({ message: "Slot deleted successfully." });
};





// fourth function will get all active public slots, eg for users to browse
// link for this is (get) /api/slots
const active_slots = async (req, res) =>{

    // there is no data to get from user or validate
    
    // 1. obtain all active public slots
    const slots = await db.all(
        `SELECT * FROM slots WHERE status = 'active'`);
    
    // 2. return the data
    return res.status(200).json({ active_requests: slots });
};






// export them so functions can be used
module.exports = {create_slot, activate_slot, delete_slot, active_slots};
