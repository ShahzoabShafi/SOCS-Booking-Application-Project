// connect to db and recieve request
const db = require('../config/db');




// first function allows owner-type-users to view all booking requests aimed at them.
const get_requests = async (req, res) =>{

    // 1. collect data
    // all we need is the user_id of the owner, which is given 
    const owner_id = req.user.id; // thru JWT

    // 2. validation - may not be needed since there's no actual input. 
    // is the user truly an owner?
    const owner = await db.get(
        "SELECT id, role FROM users WHERE id = ?",
        [owner_id]);

    if (!owner){
        return res.status(404).json({ message: "Not an existing user." }); // how could this be possible? Anyway its safe
    }

    if (owner.role != "owner"){
        return res.status(403).json({ message: "Only users of type owner can view booking requests destined to them." });
    }

    // 3. Obtain the meeting requests associated to this owner thru the db
    const meeting_requests = await db.all(
        `SELECT * FROM meeting_requests WHERE owner_id = ? AND request_status = 'pending' ORDER BY created_at ASC;`,
        [owner_id]
    );

    // 4. return crap
    // note returning an empty array is ok / thats what we want. (?) (talk to frontend)
    return res.status(200).json({ pending_requests: meeting_requests});
};

module.exports = {get_requests};




// second function allows owner-type-user to handle a request (ie accept or decline).
const update_request = async (req, res) =>{

    // 1. collect data
    const request_id = req.body.request_id;
    const status = req.body.status;

    // 2. validation
    const request = await db.get(
        "SELECT * FROM meeting_requests WHERE request_id = ? AND owner_id = ?",
        [request_id, owner_id]); 
    
    // the following shouldnt be possible if we get input from owner clicking on requests that exist. Assuming thats the frontend approach.
    if (!request){
        return res.status(404).json({ message: "Not an existing booking request." }); 
    }

    // the status
    if (status != "accepted" && status != "declined"){
        return res.status(400).json({ message: "Invalid booking request status update. Must be either 'accepted' or 'declined'." });
    }
    
    // 3. update the status of the booking based on input.
    const modify_request = await db.run(
        `UPDATE meeting_requests
        SET request_status = ?
        WHERE request_id = ?`,
        [status, request_id]);

    return res.status(200).json({ message: "Request updated successfully." });
};

module.exports = {update_request};
