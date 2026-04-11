// import express and controller functions
const express = require("express");
const router = express.Router();
const {create_slot, activate_slot, delete_slot, active_slots, createRecurringSlots} = require('../controllers/slotControllers');
const { protect } = require("../middleware/authMiddleware");

// forward request to the correct controller function
router.post("/create", protect, create_slot);
router.put("/:id/activate", protect, activate_slot);
router.delete("/:id/delete", protect, delete_slot);
router.get("/", active_slots);
router.post('/recurring', protect, createRecurringSlots);

// export it so that server.js can use it.
module.exports = router;


