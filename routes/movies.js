const express = require("express");
const router = express.Router();

const path = require("path");
const Movie = require("../models/movie");
const Director = require("../models/director");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

//All Movies
router.get("/", async (req, res) => {
    let query = Movie.find();
    if (req.query.title != null && req.query.title != "") {
        query = query.regex("title", new RegExp(req.query.title, "i"));
    }
    if (req.query.releasedBefore != null && req.query.releasedBefore) {
        query = query.lte("releaseDate", req.query.releasedBefore);
    }
    if (req.query.releasedAfter != null && req.query.releasedAfter) {
        query = query.gte("releaseDate", req.query.releasedAfter);
    }
    try {
        const movies = await query.exec();
        res.render("movies/index", {
            movies: movies,
            searchOptions: req.query,
        });
    } catch (error) {
        res.redirect("/");
    }
});

//New Movie Route
router.get("/new", async (req, res) => {
    renderNewPage(res, new Movie());
});

//POST MOVIE
router.post("/", async (req, res) => {
    //CRETAING NEW MOVIE
    const movie = new Movie({
        title: req.body.title,
        description: req.body.description,
        releaseDate: req.body.releaseDate,
        duration: req.body.duration,
        director: req.body.director,
    });
    savePoster(movie, req.body.poster);
    try {
        //TRY SAVING MOVIE
        const newMovie = await movie.save();
        res.redirect("movies");
        console.log("Movie Created");
    } catch (error) {
        console.error(error);
        //HNADLE ERROR
        renderNewPage(res, movie, true);
    }
});

async function renderNewPage(res, movie, hasError = false) {
    try {
        const directors = await Director.find();
        const params = {
            directors: directors,
            movie: movie,
        };
        if (hasError) params.errorMessage = "Error Creating Movie";
        res.render("movies/new", params);
    } catch (error) {
        res.redirect("/movies");
    }
}

function savePoster(movie, posterEncoded) {
    if (posterEncoded == null) return;
    const poster = JSON.parse(posterEncoded);
    if (poster !== null && imageMimeTypes.includes(poster.type)) {
        movie.poster = new Buffer.from(poster.data, "base64");
        movie.posterImgType = poster.type;
    }
}

module.exports = router;
