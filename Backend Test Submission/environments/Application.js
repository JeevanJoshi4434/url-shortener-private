const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";
const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/shorturl";
const JWT_SECRET = process.env.SECRET || "secret";
const NODE_ENV = process.env.NODE_ENV || "development";
module.exports = { PORT, DB_URI, JWT_SECRET,FRONTEND_URL, NODE_ENV };