// import express and controller functions
const express = require("express");
const router = express.Router();
const {create_slot, activate_slot, delete_slot, active_slots, createRecurringSlots, all_my_slots} = require('../controllers/slotControllers'); // basic slot management apis
const {propose_slots, invite, vote, view_slot_votes, confirm_slot} = require('../controllers/groupMeetingControllers'); // type 2 (group meeting) apis
const { protect } = require("../middleware/authMiddleware");



// forward request to the correct controller functions

// basic slot management apis
router.post("/create", protect, create_slot);
router.put("/:id/activate", protect, activate_slot);
router.delete("/:id/delete", protect, delete_slot);
router.get("/", active_slots);
router.post('/recurring', protect, createRecurringSlots);
router.get('/all', protect, all_my_slots);

// group method apis
router.post("/group", protect, propose_slots);
router.post("/group/:id/invite", protect, invite);
router.post("/group/:id/vote", protect, vote);
router.get("/group/:ownerId/votes", protect, view_slot_votes);
router.post("/group/:id/confirm", protect, confirm_slot);

// export it so that server.js can use it.
module.exports = router;
