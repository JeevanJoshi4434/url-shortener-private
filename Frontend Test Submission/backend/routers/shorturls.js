const UrlController = require("../controllers/url.controller");
const express = require("express");
const router = express.Router();

router.get("/shorturls/redirect/:id", UrlController.getShortUrl);
router.get("/shorturls/", UrlController.getAllShortUrls);
router.post("/shorturls/", UrlController.createShortUrl);
router.get("/shorturls/:id", UrlController.getShortUrlStats);

module.exports = router;