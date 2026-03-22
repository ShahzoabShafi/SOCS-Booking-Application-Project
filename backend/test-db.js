// delete after server db connection is done
const pool = require('./config/db');

pool.query('SELECT 1')
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Connection failed:', err.message));