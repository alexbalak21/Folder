const mongoose = require("mongoose");
const path = require("path");

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

movieSchema.virtual("posterPath").get(function () {
    if (this.poster != null) {
        return path.join("/", posterImgBasePath, this.poster);
    }
});

module.exports = mongoose.model("movie", movieSchema);
module.exports.posterImgBasePath = posterImgBasePath;
