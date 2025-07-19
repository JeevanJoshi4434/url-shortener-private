const mongoose = require("mongoose");
const { DB_URI } = require("../environments/Application");
const Log = require("../utils/Logger");

async function connectDB() {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        Log("backend", "info", "db", "Database is Connected."); 
    } catch (err) {
        Log("backend", "fatal", "db", `Error: ${err.message}.`); 
        throw err;
    }
}

module.exports = connectDB;
