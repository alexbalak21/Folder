require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");

const { parse } = require("path/posix");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//ROUTERS
const indexRouter = require("./routes/index");
const directorRouter = require("./routes/directors");

app.use("/", indexRouter);
app.use("/directors", directorRouter);

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => {
    console.log("Connected to DB");
    app.listen(process.env.PORT || 3000, () =>
        console.log("Server Started at: http://localhost:3000/")
    );
});
