var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/adminLogin", (req, res) => {
  res.render("backend/adminLogin", { title: "Admin Login" });
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
