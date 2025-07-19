const url = require("../models/url");
const Log = require("../utils/Logger");
const axios = require("axios");


class UrlService {

    static async getURLRequest(id, IP, ref) {
        if (typeof id !== "string") {
            Log("backend", "error", "controller", `Error: getURL(id, IP), id is not a string.`);
        }
        if (typeof IP !== "string") {
            Log("backend", "error", "controller", `Error: getURL(id, IP), IP is not a string.`);
        }
        const data = await url.findById({ _id: id });
        if (!data) {
            Log("backend", "error", "controller", `Error: Document with id=${id} is not found.`);
            return null;
        }
        Log("backend", "debug", "controller", `IP: ${IP}, Referrer: ${ref}, ExpectedExpiry: ${new Date(data.expireIn + data.createdAt.getTime()).toISOString()}, ActualExpiry: ${new Date(Date.now()).toISOString()}`);
        if ((data.expireIn + data.createdAt.getTime()) < Date.now()) {
            Log("backend", "error", "controller", `Error: Document with id=${id} is expired.`);
            return {
                expired: true
            };
        }
        const referrer = ref || null;
        let location = {};
        try {
            const geoRes = await axios.get(`http://ip-api.com/json/${IP}?fields=country,regionName,city`);
            const { country, regionName, city } = geoRes.data;
            location = {
                country,
                region: regionName,
                city
            };
        } catch (err) {
            Log("backend", "warn", "controller", `Geo lookup failed for IP ${IP}: ${err.message}`);
        }


        data.clicks.push({ time: Date.now(), ip: IP, referrer, location });
        await data.save();
        return data;
    }

    static async getURL(id) {
        if (typeof id !== "string") {
            Log("backend", "error", "controller", `Error: getURL(id), id is not a string.`);
        }
        const data = await url.findById({ _id: id });
        if (!data) {
            Log("backend", "error", "controller", `Error: Document with id=${id} is not found.`);
            return null;
        }
        return data;
    }

    static async getAllURLs() {
        const data = await url.find({});
        if (!data) {
            Log("backend", "info", "controller", `Database is empty.`);
            return null;
        };
        return data;
    }


    static async createURL(link, validity = 30000, shortCode = null) {
        if (typeof link !== "string") {
            Log("backend", "error", "controller", `Error: createURL(link, validity, shortCode), link is not a string.`);
            return null;
        }

        if (typeof validity !== "number") {
            Log("backend", "error", "controller", `Error: createURL(link, validity, shortCode), validity is not a number.`);
            return null;
        }

        if (shortCode && typeof shortCode !== "string") {
            Log("backend", "error", "controller", `Error: createURL(link, validity, shortCode), shortCode is not a string.`);
            return null;
        }

        if (shortCode !== null && shortCode.length > 0) {
            const isExists = await url.findById(shortCode);
            console.log(isExists, shortCode);
            if (isExists) {
                Log("backend", "info", "service", `ShortCode "${shortCode}" already exists`);
            } else {
                return await this.create(link, validity, shortCode);
            }
        }
        return await this.create(link, validity);
    }

    static async create(link, validity = 30000, shortCode = null) {
        if (shortCode && shortCode.length > 0) {
            return await url.create(
                {
                    originalUrl: link,
                    expireIn: validity,
                    _id: shortCode
                }
            )
        }
        return await url.create(
            {
                originalUrl: link,
                expireIn: validity
            }
        );
    }
}

module.exports = UrlService;