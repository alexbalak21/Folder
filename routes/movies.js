const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Movie = require("../models/movie");
const uploadPath = path.join("public", Movie.posterImgBasePath);
const Director = require("../models/director");
const fs = require("fs");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    },
});

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
router.post("/", upload.single("poster"), async (req, res) => {
    const filename = req.file != null ? req.file.filename : null;
    //CRETAING NEW MOVIE
    const movie = new Movie({
        title: req.body.title,
        description: req.body.description,
        releaseDate: req.body.releaseDate,
        duration: req.body.duration,
        director: req.body.director,
        poster: filename,
    });
    try {
        //TRY SAVING MOVIE
        const newMovie = await movie.save();
        res.redirect("movies");
        console.log("Movie Created");
    } catch (error) {
        console.error(error);
        //HNADLE ERROR
        if (movie.poster != null) removePoster(movie.poster);
        renderNewPage(res, movie, true);
    }
});

function removePoster(fileName) {
    fs.unlink(path.join(uploadPath, fileName), (error) => {
        console.error(error);
    });
}

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

module.exports = router;
