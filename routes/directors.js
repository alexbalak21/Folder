const express = require("express");
const router = express.Router();
const Director = require("../models/director");

//All Directors
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== "") {
        console.log(req.query.name);
        searchOptions.name = new RegExp(req.query.name, "i");
        console.log(searchOptions.name);
    }
    try {
        const directors = await Director.find(searchOptions);
        res.render("directors/index", {
            directors: directors,
            searchOptions: req.query,
        });
    } catch (error) {
        res.redirect("/");
    }
});

//NEW
router.get("/new", (req, res) => {
    res.render("directors/new", { director: new Director() });
});

//Create Director
router.post("/", async (req, res) => {
    const director = new Director({ name: req.body.name });
    try {
        const newDirector = await director.save();
        // res.redirect(`directors/${newDirector.id}`);
        res.redirect("directors/");
    } catch (error) {
        res.render("directors/new", {
            director: director,
            errorMessage: "Error creating Director",
        });
    }
});

module.exports = router;
