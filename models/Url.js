const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    pathId: {
        type: String,
        required: true,
    },
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    visits: {
        type: Number,
        required: true,
        default: 0,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Url", UrlSchema);