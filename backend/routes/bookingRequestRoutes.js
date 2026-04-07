// import express and controller functions
const express = require("express");
const router = express.Router();
const {request_booking} = require('../controllers/bookingRequestController');
const {get_requests, update_request} = require('../controllers/ownerRequestControlCenter');
const { protect } = require("../middleware/authMiddleware");

// forward the request to the correct controller function
router.post("/request", request_booking);
router.get("/requests", get_requests);
router.put("/requests/:id", update_request);

// export the router so that server.js can access it thru app.use('/api/bookings', bookings); 
module.exports = router;
