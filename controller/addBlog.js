require("../models/db");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const urlencodedparser = bodyParser.urlencoded({ extended: false });
const mongoose = require("mongoose");

const ObjectID = require("mongodb").ObjectID;

const blogModel = require("../models/blog.model").blogModel;
const adminModel = require("../models/blog.model").adminModel;

router.get("/", (req, res) => {
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

router.post("/addBlog/", (req, res) => {
  insertRecord(req, res);
});
router.post("/addBlog/:id", (req, res) => {
  updateRecord(req, res);
});
router.get("/addBlog/:id", (req, res) => {
  let selectedId = req.params.id;
  let filter = { _id: ObjectID(selectedId) };
  blogModel.findById(filter, (err, doc) => {
    if (!err) {
      res.render("backend/addBlog", {
        blogModel: doc,
      });
    }
  });
});

router.get("/listBlog", (req, res) => {
  blogModel.find((err, docs) => {
    if (!err) {
      res.render("backend/listBlog", {
        list: docs,
      });
    } else {
      console.log("Error in retrieving employee list :" + err);
    }
  });
});

router.post("/adminLogin", urlencodedparser, (req, res) => {
  var data = req.body;
  adminModel.create(data, (err, doc) => {
    if (!err) {
      console.log("record inserted");
      res.status(200).json(doc);
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

router.get("/listBlog/delete/:id", (req, res) => {
  let selectedId = req.params.id;
  let filter = { _id: ObjectID(selectedId) };
  blogModel.deleteOne(filter, (err, result) => {
    if (err) {
      console.log("Error during record delete ", err);
    } else {
      console.log("Record deleted");
      res.redirect("/listBlog");
    }
  });
});

function insertRecord(req, res) {
  let data = req.body;
  blogModel.create(data, (err, doc) => {
    if (!err) {
      console.log("data inserted");
      res.redirect("/listBlog");
      // res.render("backend/addBlog", {
      //   blogModel: req.body,
      // });
    } else {
      console.log("error during data insert" + err);
    }
  });
}

function updateRecord(req, res) {
  let selectedId = req.params.id;
  let filterId = { _id: ObjectID(selectedId) };
  //let id = req.body._id;
  let data = req.body;
  let update = { $set: data };
  blogModel.updateOne(filterId, update, (err, result) => {
    if (err) {
      console.log("Error update info" + err);
    } else {
      console.log("record updated");
       res.redirect("/listBlog");
      // res.render("backend/listBlog", {
      //   blogModel:result,
      // });
    }
  });
}

module.exports = router;
