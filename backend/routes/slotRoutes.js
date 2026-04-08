// import express and controller functions
const express = require("express");
const router = express.Router();
const {create_slot, activate_slot, delete_slot, active_slots} = require('../controllers/slotControllers');
const { protect } = require("../middleware/authMiddleware");

// forward request to the correct controller function
router.post("/create", create_slot);
router.put("/:id/activate", activate_slot);
router.delete("/:id/delete", delete_slot);
router.get("/", active_slots);

// export it so that server.js can use it.
module.exports = router;
