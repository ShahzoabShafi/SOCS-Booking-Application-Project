const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

//temporary for testing only
// const { protect } = require('../middleware/authMiddleware');

// router.get('/protected-test', protect, (req, res) => {
//   res.json({ message: 'Access granted!', user: req.user });
// });
// end temporary test

module.exports = router;