const express = require("express");
const router = express.Router();

const path = require("path");
const Movie = require("../models/movie");
const Director = require("../models/director");
const { error } = require("console");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

//GET ALL MOVIES
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

//NEW MOVIE FORM
router.get("/new", async (req, res) => {
    renderFormPage(res, new Movie(), "new");
});

//CREATE MOVIE - POST MOVIE
router.post("/", async (req, res) => {
    const movie = new Movie({
        title: req.body.title,
        description: req.body.description,
        releaseDate: req.body.releaseDate,
        duration: req.body.duration,
        director: req.body.director,
    });
    savePoster(movie, req.body.poster);
    try {
        const newMovie = await movie.save();
        res.redirect(`movies/${newMovie.id}`);
    } catch (error) {
        console.error(error);
        let errorMsg = "Error Creating Movie";
        renderFormPage(res, movie, "new", errorMsg);
    }
});

//GET MOVIE BY ID
router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate("director").exec();
        res.render("movies/show", { movie: movie });
    } catch (error) {
        res.redirect("/");
    }
});

//EDIT MOVIE FORM
router.get("/:id/edit", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        renderFormPage(res, movie, "edit");
    } catch (error) {
        res.redirect("/");
    }
});

//UPDATE MOVIE - PUT MOVIE
router.put("/:id", async (req, res) => {
    let movie;
    try {
        movie = await Movie.findById(req.params.id);
        movie.title = req.body.title;
        movie.description = req.body.description;
        movie.releaseDate = new Date(req.body.releaseDate);
        movie.duration = req.body.duration;
        movie.director = req.body.director;
        if (req.body.poster != null && req.body.poster != "") {
            savePoster(movie, req.body.poster);
        }
        await movie.save();
        res.redirect(`/movies/${movie.id}`);
    } catch (error) {
        const errorMsg = "Error Updating Movie";
        console.log(error);
        if (movie != null) renderFormPage(res, movie, "edit", errorMsg);
        else res.redirect("/");
    }
});

//DELETE MOVIE
router.delete("/:id", async (req, res) => {
    let movie;
    try {
        movie = await Movie.findById(req.params.id);
        await movie.remove();
        res.redirect("/movies");
    } catch {
        if (movie == null)
            res.render("movies/show", { movie: movie, errorMessage: "Could not remove Movie" });
        else res.redirect("/");
    }
});

async function renderFormPage(res, movie, form, errorMsg = "") {
    try {
        const directors = await Director.find();
        const params = {
            directors: directors,
            movie: movie,
        };
        if (errorMsg != "") params.errorMessage = errorMsg;
        res.render(`movies/${form}`, params);
    } catch (error) {
        res.redirect("/movies");
    }
}

function savePoster(movie, posterEncoded) {
    if (posterEncoded == null) return null;
    const poster = JSON.parse(posterEncoded);
    if (poster !== null && imageMimeTypes.includes(poster.type)) {
        movie.poster = new Buffer.from(poster.data, "base64");
        movie.posterImgType = poster.type;
    } else return null;
}

module.exports = router;
