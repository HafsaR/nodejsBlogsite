var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Blog Site" });
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

router.get("/adminLogin", (req, res) => {
  res.status(200).render("backend/adminLogin", { title: "Admin Login" });
});

router.get("/admin", function(req, res, next) {
  res.render("backend/index", { title: "Admin Site" });
});

router.get("/addBlog/", (req, res) => {
  res.render("backend/addBlog", { title: "Add Blog" });
});

router.get("/listBlog", (req, res) => {
  res.render("backend/listBlog", { title: "Blog Info" });
});


module.exports = router;
