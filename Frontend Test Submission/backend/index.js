const express = require("express");
const fs = require("fs");
const path = require("path");
const connectDB = require("./configs/database");
const { PORT } = require("./environments/Application");
require("dotenv").config();
const urlRoute = require("./routers/shorturls");
const HTTP_STATUS = require("./utils/HttpStatus");
const cors = require("cors");
class App {
    constructor() {
        this.app = express();
        this.port = PORT;
        this.app.use(cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        this.middlewares();
        this.routes();
        this.setAPISizeLimit("10mb");
    }

    middlewares() {
        this.app.use(express.json());
    }

    routes() {
        this.app.use("/api/v1", urlRoute);
    
        const frontendPath = path.join(__dirname, "../build");
        const indexFile = path.join(frontendPath, "index.html"); 
        this.app.use(express.static(frontendPath)); 
        this.app.get(/^\/(?!api\/v1).*/, (req, res) => {
            if (fs.existsSync(indexFile)) {
                res.sendFile(indexFile);
            } else {
                res.status(500).send("Frontend build not found.");
            }
        });
    }


    setAPISizeLimit(limit) {
        this.app.use(express.json({ limit: limit }));
        this.app.use(express.urlencoded({ limit: limit, extended: true }));
    }

    async db() {
        await connectDB();
    }

    async start() {
        await this.db();
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

module.exports = new App();
