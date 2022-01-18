const mongoose = require("mongoose");
const Movie = require("./movie");

const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

directorSchema.pre("remove", function (next) {
    Movie.find({ director: this.id }, (error, movies) => {
        if (error) next(error);
        else if (movies.length > 0) {
            next(new Error("This Director has movies in DB"));
        } else next();
    });
});

module.exports = mongoose.model("director", directorSchema);
