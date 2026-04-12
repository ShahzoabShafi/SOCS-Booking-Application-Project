// import express and controller functions
const express = require("express");
const router = express.Router();
const {create_slot, activate_slot, delete_slot, active_slots, createRecurringSlots} = require('../controllers/slotControllers'); // basic slot management apis
//const {propose_slots, invite, vote, view_slot_votes, confirm_slot} = require('../controllers/groupMeetingControllers'); // type 2 (group meeting) apis
const { protect } = require("../middleware/authMiddleware");

// forward request to the correct controller function

router.post("/create", protect, create_slot);
router.put("/:id/activate", protect, activate_slot);
router.delete("/:id/delete", protect, delete_slot);
router.get("/", active_slots);
router.post('/recurring', protect, createRecurringSlots);

//router.post("/group", propose_slots);
//router.post("/group/:id/invite", invite);
//router.post("/group/:id/vote", vote);
//router.get("/group/:ownerId/votes", view_slot_votes);
//router.post("/group/:id/confirm", confirm_slot);

// export it so that server.js can use it.
module.exports = router;
