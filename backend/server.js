// Shahzoab Shafi
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path=require("path")

console.log(process.env.DB_PATH)

// routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboard');
const bookings = require('./routes/bookingRequestRoutes');
const slots = require('./routes/slotRoutes');
const confirmedBookings = require('./routes/confirmedBookingsRoutes');
const calendarRoutes = require('./routes/calendarRoutes');

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
app.use('/api/calendar', calendarRoutes);

// Base route to test server is running



const PORT = process.env.PORT || 5000;
// Serve React build
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all (MUST be last)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`); // 0.0.0.0 is any host not just localhost. changed to this to pls pls deploy
});

