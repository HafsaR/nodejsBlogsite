require("../models/db");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const urlencodedparser = bodyParser.urlencoded({ extended: false });
const mongoose = require("mongoose");
const blogModel = require("../models/blog.model");
const adminLogin = mongoose.model("adminLogin");

router.get("/", (req, res) => {
  //res.send("data connected");
  res.render("index", { title: "Blog site" });
});
router.get("/adminLogin", (req, res) => {
  res.status(200).render("backend/adminLogin", { title: "Admin Login" });
});

router.get("/admin", function (req, res, next) {
  res.render("backend/index", { title: "Admin Site" });
});

router.get("/admin", function (req, res, next) {
  res.render("backend/index", { title: "Admin Site" });
});

router.get("/addBlog/", (req, res) => {
  res.render("backend/addBlog", { title: "Add Blog" });
});

router.post("/addBlog", (req, res) => {
  let data = req.body;
  console.log(data);
  blogModel.create(data, (err, small) => {
    if (err) {
      console.log("error insertion record", err);
    } else {
      console.log("record inserted");
      res.status(200).json(small);
    }
  });
});
router.get("/listBlog", (req, res) => {
  res.render("backend/listBlog", { title: "Blog Info" });
});

router.post("/adminLogin", urlencodedparser, (req, res) => {
  var login = new adminLogin();
  login.username = req.body.username;
  login.password = req.body.password;
  login.save((err, doc) => {
    if (!err) {
      console.log();
    } else console.log("Errors during record insertion : " + err);
  });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});
router.get("/blogSingle", (req, res) => {
  res.render("blogSingle", { title: "Single blog" });
});

router.get("/blogGrid", (req, res) => {
  res.render("blogGrid", { title: "All blogs" });
});

module.exports = router;
