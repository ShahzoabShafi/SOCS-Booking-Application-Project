// import express and controller functions
const express = require("express");
const router = express.Router();
const {request_booking, cancelBooking, all_owners} = require('../controllers/bookingRequestController');
const {get_requests, update_request} = require('../controllers/ownerRequestControlCenter');
const { protect } = require("../middleware/authMiddleware"); // JWT business.

// forward the request to the correct controller function
router.post("/request", protect, request_booking);
router.get("/requests", protect, get_requests);
router.put("/requests/:id", protect, update_request);
router.delete('/:id', protect, cancelBooking);
router.get("/request/owners", protect, all_owners);

// export the router so that server.js can access it thru app.use('/api/bookings', bookings); 
module.exports = router;
