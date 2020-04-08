require("../models/db");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const urlencodedparser = bodyParser.urlencoded({ extended: false });
const mongoose = require("mongoose");
const blogModel = require("../models/blog.model");

router.get("/", (req, res) => {
  //res.send("data connected");
  res.render("index", { title: "Blog site" });
});

// router.get("/adminLogin", (req, res) => {
//   //   let data = req.body;
//   //   console.log(data);
//   //   blogModel.create(data, function(err, small) {
//   //     if (err) {
//   //       return handleError(err);
//   //     } else {
//   //       console.log("record inserted");
//   //       res.status(200).json(small);
//   //     }
//   //     // saved!
//   //   });
//   res.render("backend/adminLogin", { title: "Login" });
// });

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

router.get("/listBlog", (req, res) => {
  res.render("backend/listBlog", { title: "Blog Info" });
});

router.post("/adminLogin",urlencodedparser, (req, res) => {
  let data = req.body;
  console.log(data);
  blogModel.create(data, (err, docs) => {
    if (err) {
      return handleError(err);
    } else {
      console.log("record inserted");
      res.status(200).json(docs);
    }
  });
});
module.exports = router;
