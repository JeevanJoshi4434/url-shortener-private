const { FRONTEND_URL } = require("../environments/Application");
const UrlService = require("../services/url.service");
const ApiResponse = require("../utils/APIResponse");
const HTTP_STATUS = require("../utils/HttpStatus");
const Log = require("../utils/Logger");


class UrlController {
    static async createShortUrl(req, res) {
        try {
            const { url, validity, shortCode } = req.body;

            let originalUrl = url;
            let expireIn = validity;
            
            if (!originalUrl) {
                Log("backend", "error", "controller", `Error: createShortUrl(req, res), originalUrl is not provided.`);
                return ApiResponse.error(res, "Original URL is required.", HTTP_STATUS.BAD_REQUEST);
            }

            if (typeof originalUrl !== "string") {
                Log("backend", "error", "controller", `Error: createShortUrl(req, res), originalUrl is not a string.`);
                return ApiResponse.error(res, "Original URL must be a string.", HTTP_STATUS.BAD_REQUEST);
            }
            
            const shortUrl = await UrlService.createURL(originalUrl, expireIn, shortCode);

            const data = {
                "shortLink": `${FRONTEND_URL}/${shortUrl._id}`,
                "expiry": `${new Date(shortUrl.expireIn + shortUrl.createdAt.getTime()).toISOString()}`
            }

            return ApiResponse.success(res, data);
        } catch (error) {
            Log("backend", "error", "controller", `Error: ${error.message}.`);
            return ApiResponse.error(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    static async getShortUrl(req, res) {
        try {

            const { id } = req.params;

            if (!id) {
                Log("backend", "error", "controller", `Error: getShortUrl(req, res), id is not provided.`);
                return ApiResponse.error(res, "Short URL ID is required.", HTTP_STATUS.BAD_REQUEST);
            }

            const rawIP = req.headers["x-forwarded-for"] || req.ip;
            const IP = rawIP.replace("::ffff:", "").replace("::1", "127.0.0.1");
            
            const shortUrl = await UrlService.getURLRequest(id, IP, req.referrer || null);

            if (!shortUrl) return ApiResponse.error(res, "Short URL not found.", HTTP_STATUS.NOT_FOUND);

            if (shortUrl.expired) {
                Log("backend", "error", "controller", `Error: getShortUrl(req, res), shortUrl is expired.`);
                return ApiResponse.error(res, "Short URL is expired.", HTTP_STATUS.NOT_FOUND);
            }

            const data = {
                redirect: shortUrl.originalUrl,
            }

            return ApiResponse.success(res, data);

        } catch (error) {

            Log("backend", "error", "controller", `Error: ${error.message}.`);
            return ApiResponse.error(res, "Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    static async getShortUrlStats(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                Log("backend", "error", "controller", `Error: getShortUrlStats(req, res), id is not provided.`);
                return ApiResponse.error(res, "Short URL ID is required.", HTTP_STATUS.BAD_REQUEST);
            }

            const shortUrl = await UrlService.getURL(id, req.ip);

            if (!shortUrl) return ApiResponse.error(res, "Short URL not found.", HTTP_STATUS.NOT_FOUND);
            const data = {
                shortUrl,
                clicks: shortUrl.clicks.length || 0
            }
            return ApiResponse.success(res, data);
        } catch (error) {

            Log("backend", "error", "controller", `Error: ${error.message}.`);
            return ApiResponse.error(res, "Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    static async getAllShortUrls(req, res) {
        try {

            const shortUrls = await UrlService.getAllURLs();

            return ApiResponse.success(res, shortUrls);
        } catch (error) {

            Log("backend", "error", "controller", `Error: ${error.message}.`);
            return ApiResponse.error(res, "Server Error", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = UrlController;