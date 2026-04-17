// import express and controller functions
const express = require("express");
const router = express.Router();
const {export_calendar} = require('../controllers/calendarControllers'); 
const { protect } = require("../middleware/authMiddleware");

// forward request to the correct controller functions
router.post("/export", protect, export_calendar);

// export it so that server.js can use it.
module.exports = router;
