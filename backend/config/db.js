const sqlite3 = require('sqlite3'); // load sql
require('dotenv').config(); // reads .env and puts it in process.env

// create connection to .env (db.js will use values from there)
const path_to_db = process.env.DB_PATH;
const db = new sqlite3.Database(path_to_db, (err) => {
    if (err){
        console.error('Database connection failed:', err.message);
    }
    else{
        console.log('Database connected successfully!');
    }
});

module.exports = db; // now other files can require the db





// the below code is tailored to a mysql stack, which we're not using. above works for sqlite3.
/*
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // Required for Aiven cloud MySQL
  waitForConnections: true,
  connectionLimit: 10,
});


// Test the connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connected successfully!');
    connection.release();
  }
});


module.exports = pool.promise(); // .promise() lets us use async/await

*/

// the module.exports line makes no sense in sqlite: there is no pool, no promise. maybe exists come complex alternative for sqlite
