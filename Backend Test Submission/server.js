
const app = require("./index.js");
const Log = require("./utils/Logger.js");

app.start().catch(err =>{
    Log("backend", "fatal", "service", `Error: ${err.message}.`);
    process.exit(1);
});