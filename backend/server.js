const express = require('express');
const cors = require('cors');
require('dotenv').config();

// connect to db
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve(__dirname, '..', 'database', 'socs_booking.db');
// test connection AAAAAAAAAAAAH
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) =>{
        if (err) {
                console.error('Failed to connectto db');
                console.error('Error details: ', err.message);
        } else {
                console.log('Connected successfully!');
        }
});




// routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboard');
const bookings = require('./routes/bookingRequestRoutes');
const slots = require('./routes/slotRoutes');
const confirmedBookings = require('./routes/confirmedBookingsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true})); // extended:true should allow more complex data like arrays to pass thru.

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bookings', bookings);
app.use('/api/slots', slots);
app.use('/api/confirmedBookings', confirmedBookings);

// Base route to test server is running
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`); // 0.0.0.0 is any host not just localhost. changed to this to pls pls deploy
});
