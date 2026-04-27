const sqlite3 = require('sqlite3'); // load sql
const {open} = require('sqlite'); // attempt to fix bug where supposedly sqlite3 doesnt have .get() or .all(), causing undefined things to be returned.
                                  // this is a promise-based wrapper type thing.
require('dotenv').config(); // reads .env and puts it in process.env

async function connectDB() {
    try {
        const db = await open({
            filename: process.env.DB_PATH,
            driver: sqlite3.Database
        });
        console.log('Database connected successfully!');
        return db;
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
}

module.exports = connectDB();
    


// this is old version before addition of require('sqlite') //////////////////////
// create connection to .env (db.js will use values from there)
//const path_to_db = process.env.DB_PATH;
//
//const db = new sqlite3.Database(path_to_db, (err) => {
//    if (err){
//        console.error('Database connection failed:', err.message);
//    }
//    else{
//        console.log('Database connected successfully!');
//    }
//});
//
//module.exports = db; // now other files can require the db
