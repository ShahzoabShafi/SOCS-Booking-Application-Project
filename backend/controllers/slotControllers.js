// Connect to db and recieve request, which is recieved and parsed (JSON or urlencoded) by server.js
const dbPromise = require('../config/db');



// first function allows owner to create a new slot.
// link for this is (put) /api/slots/create
const create_slot = async (req, res) => {

    // new version of db setup makes this necessary
    const db = await dbPromise;



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
    if (start >= end) {
        return res.status(400).json({ message: "End time must be later than start time." });
    }

    if (number_weeks_recurrence < 0) {
        return res.status(400).json({ message: "Invalid number of weeks recurrence." });
    }

    // this is where we see our slot creation approach is maybe too simple... 
    // do we need different functions for all three methods...
    if (slot_type != "request_meeting" && slot_type != "group_meeting" && slot_type != "office_hours") {
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
const activate_slot = async (req, res) => {
     
    // new version of db setup makes this necessary
    const db = await dbPromise;



    // 1. Get data
    const slot_id = req.body.slot_id;
    const owner_id = req.user.id;

    // 2. Validate data
    const slot = await db.get(
        `SELECT * FROM slots WHERE slot_id = ? AND user_id = ?`,
        [slot_id, owner_id]);

    if (!slot) {
        return res.status(404).json({ message: "Slot doesn't exist." });
    }

    if (slot.status == 'active') {
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
const delete_slot = async (req, res) => {

    // new version of db setup makes this necessary
    const db = await dbPromise;



    // 1. Get data
    const slot_id = req.body.slot_id;
    const user_id = req.user.id;

    // 2. validate data
    const slot = await db.get(
        `SELECT * FROM slots WHERE slot_id = ? AND user_id= ?`,
        [slot_id, user_id]);

    if (!slot) {
        return res.status(404).json({ message: "Slot doesn't exist." });
    }

    // 3. Delete the slot 
    const delete_status = await db.run(
        `DELETE FROM slots WHERE slot_id = ?`,
        [slot_id]);

    // 4. Notify of successful change
    return res.status(200).json({ message: "Slot deleted successfully." });
};








// fourth function will get all active public slots associated to ONE owner, for users to browse
// link for this is (get) /api/slots/owner_active_slots?owner_id=...
const owner_active_slots = async (req, res) => {
    
    // new version of db setup makes this necessary
    const db = await dbPromise;

    // 1. get data and validate it 
    const owner_id = req.query.owner_id;
    if (!owner_id){
        return res.status(400).json( { message: "owner_id not provided or invalid." } );
    }
    
    const owner = await db.get(
        `SELECT * FROM users WHERE user_id = ? AND role = 'owner' `,
        [owner_id]
    );
    if (!owner){
        return res.status(404).json({ message: "No such slot owner." }); 
    }

    // Get all active public slots from that owner
    try{
        const slots = await db.all(
            `SELECT slot_id, slot_title, start_time, end_time, number_weeks_recurrence, slot_type, created_at 
            FROM slots WHERE status = 'active' AND user_id = ?`,
            [owner_id]
        );
        
        // return the data
        return res.status(200).json({ message: "Active slots retrieved successfully.",
                                      active_slots: slots });
    }
    catch (err){
        return res.status(500).json({ message: "Failed to retrieve active slots.",
                                      error: err.message });
    }
};







// fifth function will get all owners from the users table that own active slots  
// link for this will be (get) /api/slots/get_slot_owners
const get_slot_owners = async (req,res) => {

    const db = await dbPromise;

    // 1. No info to retrieve - any user can call this. No inputs.

    // 2. Get list of profs
    try{
        const profs = await db.all(
            `SELECT DISTINCT u.user_id, u.email, u.name
            
            FROM users u
            JOIN slots s ON s.user_id = u.user_id
            WHERE s.status = 'active'`
        );

        return res.status(200).json({ message: "Slot owners retrieved successfully.",
                                      slot_owners: profs });
    }

    catch (err){
       return res.status(500).json({ message: "Slot owner retrieval failed.",
                                     error: err.message });
    }
}









// this function allow the owner to create recurring slots
const createRecurringSlots = async (req, res) => {

    // new version of db setup makes this necessary
    const db = await dbPromise;


    const { title, dayOfWeek, startTime, endTime, startingDate, weeks } = req.body;

    if (!title || !dayOfWeek || !startTime || !endTime || !startingDate || !weeks) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (req.user.role !== 'owner') {
        return res.status(403).json({ message: 'Only owners can create recurring slots' });
    }

    try {
        const startDate = new Date(startingDate);
        let createdCount = 0;

        for (let i = 0; i < weeks; i++) {
            const slotDate = new Date(startDate);
            slotDate.setDate(slotDate.getDate() + i * 7);

            const year = slotDate.getFullYear();
            const month = String(slotDate.getMonth() + 1).padStart(2, '0');
            const day = String(slotDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            const startDateTime = `${dateString}T${startTime}`;
            const endDateTime = `${dateString}T${endTime}`;

            await db.run(
                `INSERT INTO slots (user_id, slot_title, start_time, end_time, number_weeks_recurrence, status, slot_type)
                 VALUES (?, ?, ?, ?, ?, 'active', 'office_hours')`,
                 [req.user.id, title, startDateTime, endDateTime, weeks]
              );
            createdCount++;
        }

        res.status(201).json({ message: `${createdCount} slots created successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, ', error });
    }
};







// sixth function will get all slots - public and private, associated to an owner 
// only owners can call this 
// link for this is (get) /api/slots/all
const all_my_slots = async (req, res) => {
    
    const db = await dbPromise;

    // 1. validate owner
    const owner_id = req.user.id;

    const user_from_db = await db.get(
        `SELECT * FROM users u WHERE u.user_id = ?`,
        [owner_id]
    );

    if (user_from_db.role != "owner"){
        return res.status(403).json({ message: 'Only owners can retrieve all their slots' });
    }

    // 2. obtain all slots
    const all_slots = await db.all(
        `SELECT * FROM slots s WHERE s.user_id = ?`,
        [owner_id]
    );

    // 3. return the data
    return res.status(200).json({ my_slots: all_slots });
};

// get all available office hours slots
const getAvailableSlots = async (req, res) => {
    try {
        const db = await dbPromise;
        const slots = await db.all(
            `SELECT s.*
            FROM slots s
            LEFT JOIN bookings b ON s.slot_id = b.slot_id
            WHERE s.status = 'active'
            AND s.slot_type = 'office_hours'
            AND b.booking_id IS NULL`
        );
        if (slots.length === 0) {
            return res.status(200).json({ message: 'No available slots', available_slots: [] });
        }else{
            return res.status(200).json(slots);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error, ', error });
      }
};







// User reserves a specific slot
const reserveSlot = async (req, res) => {
    try {
        const db = await dbPromise;
        const slot_id = req.params.id;
        const user_id = req.user.id;

        const slot = await db.get('SELECT * FROM slots WHERE slot_id = ?', [slot_id]);
        const owner = await db.get('SELECT * FROM users WHERE user_id = ?', [slot.user_id]);

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (slot.status !== 'active') {
            return res.status(400).json({ message: 'Slot is not available' });
        }

        if (slot.slot_type !== 'office_hours') {
            return res.status(400).json({ message: 'Slot is not an office hours slot' });
        }

        if (slot.user_id === user_id) {
            return res.status(400).json({ message: 'You cannot book your own slot' });
        }

        const existingBooking = await db.get('SELECT * FROM bookings WHERE slot_id = ?', [slot_id]);
        if (existingBooking) {
            return res.status(400).json({ message: 'Slot is already booked' });
        }
         
        await db.run('INSERT INTO bookings (slot_id, user_id) VALUES (?, ?)', [slot_id, user_id]);
        await db.run('INSERT INTO bookings (slot_id, user_id) VALUES (?, ?)', [slot_id, owner.user_id]);
        //make slot status private
        await db.run('UPDATE slots SET status = "private" WHERE slot_id = ?', [slot_id]);


        res.status(201).json({ message: 'Slot reserved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, ', error });
    }
};





// we need to allow frontend to differentiate private-booked slots from private-notbooked slots (simply not activated yet)
// This function will retrieve all private slots that are not booked
// (get) /api/slots/private_not_booked
const private_not_booked = async (req, res) => {


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

    // 3. Retrieve slots 
    try{
        const slots = await db.all(
            `SELECT * FROM slots s 
            WHERE s.user_id = ?
            AND s.status = 'private'
            AND s.slot_id NOT IN (SELECT slot_id FROM bookings)`,
            [owner_id]
        );
            
        return res.status(200).json({ message: "Slots retrieved successfully.",
                                      private_not_booked_slots: slots});
    }
    catch (err){
        return res.status(500).json({ message: "Failed to retrieve slots.", error: err.message});
    }
} 






// now do the same but for private & booked slots
// This function will retrieve all private slots that ARE booked
// (get) /api/slots/private_booked
const private_booked = async (req, res) => {

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

    // 3. Retrieve slots 
    try{
        const slots = await db.all(
            `SELECT * FROM slots s 
            WHERE s.user_id = ?
            AND s.status = 'private'
            AND s.slot_id IN (SELECT slot_id FROM bookings)`,
            [owner_id]
        );
            
        return res.status(200).json({ message: "Slots retrieved successfully.",
                                      private_booked_slots: slots});
    }
    catch (err){
        return res.status(500).json({ message: "Failed to retrieve slots.", error: err.message});
    }
} 





// export them so functions can be used
module.exports = { create_slot, activate_slot, delete_slot, createRecurringSlots, all_my_slots, getAvailableSlots, reserveSlot, owner_active_slots, get_slot_owners, private_not_booked, private_booked };
