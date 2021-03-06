require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

//ROUTERS
const indexRouter = require("./routes/index");
const directorRouter = require("./routes/directors");
const movieRouter = require("./routes/movies");

app.use("/", indexRouter);
app.use("/directors", directorRouter);
app.use("/movies", movieRouter);

mongoose.connect(process.env.DATABASE_LOCAL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => {
    console.log("Connected to DB");
    app.listen(process.env.PORT || 3000, () =>
        console.log("Server Started at: http://localhost:3000/")
    );
});
