const mongoose = require("mongoose");

const posterImgBasePath = "uploads/posters";

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },
    releaseDate: {
        type: Date,
        require: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    poster: {
        type: String,
        required: true,
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "director",
    },
});

module.exports = mongoose.model("movie", movieSchema);
module.exports.posterImgBasePath = posterImgBasePath;
