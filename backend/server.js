const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const bookings = require('./routes/bookings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true})); // extended:true should allow more complex data like arrays to pass thru.

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookings);

// Base route to test server is running
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`); // 0.0.0.0 is any host not just localhost. changed to this to pls pls deploy
});
