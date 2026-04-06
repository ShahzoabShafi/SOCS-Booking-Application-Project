// import connection to db
const pool = require('../config/db');

// recieve request.
// server.js will parse the request body, which could be either JSON or URL-encoded.
const register = async (req, res) =>{ 
    const field1 = req.body.field1;
    const field2 = req.body.field2;
}


