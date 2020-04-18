require("./models/db");
var createError = require("http-errors");
var express = require("express");
var app = express();
var session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var blogController = require("./controller/addBlog");
const dotenv = require('dotenv')

var bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// set up BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.disable("etag");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", blogController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(PORT, () => {
  console.log("server running on PORT " + PORT);
});

module.exports = app;
