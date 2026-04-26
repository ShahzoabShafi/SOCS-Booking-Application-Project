const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbPromise = require('../config/db');

const register = async (req, res) => {

  // new db config requires this approach
  const db = await dbPromise;

  const { name, email, password } = req.body;

  // Validate email domain
  if (!email.endsWith('@mcgill.ca') && !email.endsWith('@mail.mcgill.ca')) {
    return res.status(400).json({ message: 'Invalid email domain. Must be @mcgill.ca or @mail.mcgill.ca' });
  }

  // Assign role based on email domain
  const role = email.endsWith('@mail.mcgill.ca') ? 'user' : 'owner';

  try {
    // Check if user already exists
    const existingUser = await db.get('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, ', error });
  }
};



const login = async (req, res) => {

  // new db config requires this approach
  const db = await dbPromise;


  const { email, password } = req.body;

  try {
    // 1. Wrap the callback-based sqlite3 query in a Promise

    // ryan's change: db is set up to not need this.
    //const users = await new Promise((resolve, reject) => {
    //  db.all('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
    //    if (err) {
    //      reject(err);
    //    } else {
    //      resolve(rows);
    //    }
    //  });
    //});

    // instead, we use
    const users = await db.all('SELECT * FROM users WHERE email = ?', [email]);

    // Now 'users' is guaranteed to be an actual array of rows
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = {
      id: user.user_id, // ryan's change to user_id 
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error, ', error });
  }
};

module.exports = { register, login };
