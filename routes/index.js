var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("backend/index", { title: "Express" });
});

router.get("/addBlog/", (req, res) => {
  res.render("backend/addBlog", { title: "Add Blog" });
});

router.get("/listBlog", (req, res) => {
  res.render("backend/listBlog", { title: "Blog Info" });
});

module.exports = router;
