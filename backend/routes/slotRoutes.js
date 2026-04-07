// import express and controller functions
const express = require("express");
const router = express.Router();
const {create_slot, activate_slot, delete_slot, get_active_slots} = require('../controllers/slotControllers');
const { protect } = require("../middleware/authMiddleware");

// forward request to the correct controller function
router.post("/slots", create_slot);
router.put("/slots/:id/activate", activate_slot);
router.delete("/slots/:id", delete_slot);
router.get("/slots", get_active_slots);

// export it so that server.js can use it.
module.exports = router;
