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
        type: Buffer,
        required: true,
    },
    posterImgType: {
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
    if (this.poster != null && this.posterImgType != null) {
        return `data:${this.posterImgType};charset=utf-8;base64,${this.poster.toString("base64")}`;
    }
});

module.exports = mongoose.model("movie", movieSchema);
