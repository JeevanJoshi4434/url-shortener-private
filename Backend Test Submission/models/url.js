const mongoose = require("mongoose");
const Counter = require("./sequence");
const { encodeNumber } = require("../utils/Base62Converter");

const click = new mongoose.Schema({
    time: {
        type: Date,
        default: Date.now
    },
    ip: {
        type: String,
        required: true
    },
    referrer: {
        type: String,
        default: null
    },
    location: {
        country: String,
        region: String,
        city: String
    }
})

const shortURLSchema = new mongoose.Schema({
    _id: String,
    originalUrl: {
        type: String,
        required: true
    },
    expireIn: {
        type: Number,
        default: 1800000
    },
    clicks: {
        type: [click],
        default: []
    },
}, { timestamps: true });

shortURLSchema.pre("save", async function (next) {
    const doc = this;
    if (doc.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            { _id:"shortUrl"},
            { $inc:{ seq: 1 }},
            { new: true, upsert: true }
        );
        doc._id = encodeNumber(counter.seq);
    }

    next();
})

module.exports = mongoose.model("ShortURL", shortURLSchema);