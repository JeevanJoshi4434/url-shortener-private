const UrlController = require("../controllers/url.controller");
const express = require("express");
const router = express.Router();

router.get("/redirect/:id", UrlController.getShortUrl);
router.get("/", UrlController.getAllShortUrls);
router.post("/", UrlController.createShortUrl);
router.get("/:id", UrlController.getShortUrlStats);

module.exports = router;