const db = require('./config/db');

async function main() {
    const test_get_users = await db.get("SELECT * FROM users");

    if (!test_get_users) {
        console.log("doomed (?)");
    } else {
        console.log("Should have worked.");
    }
}

main();
