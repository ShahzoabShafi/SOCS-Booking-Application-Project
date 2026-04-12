// import express and controller functions
const express = require("express");
const router = express.Router();
const {confirmed_bookings} = require('../controllers/confirmedBookingsController');
const { protect } = require("../middleware/authMiddleware"); //JWT business

// forward request to the correct controller function
router.get("/", protect, confirmed_bookings);

// export it so that server.js can use it.
module.exports = router;
