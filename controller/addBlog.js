require("../models/db");
const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
const urlencodedparser = bodyParser.urlencoded({ extended: false });
const mongoose = require("mongoose");
const session = require("express-session");
var JSAlert = require("js-alert");
const ObjectID = require("mongodb").ObjectID;

const blogModel = require("../models/blog.model").blogModel;
const adminModel = require("../models/blog.model").adminModel;
const commentModel = require("../models/blog.model").commentModule;
const contactModel = require("../models/blog.model").contactModule;

router.get("/", (req, res) => {
  var query = blogModel.find().sort({ $natural: 1 }).limit(3);
  query.exec((err, result) => {
    if (!err) {
      console.log("doc", result);
      res.render("index", { title: "Blog site", blogModel: result });
    } else {
      console.log("error", err);
    }
  });
});
router.get("/adminLogin", (req, res) => {
  res
    .status(200)
    .render("backend/adminLogin", { title: "Admin Login", error: " " });
});

router.post("/auth", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    if (username == "admin" && password == "admin") {
      req.session.loggedin = true;
      (req.session.username = "admin"),
        res.render("backend/index", { success: "Login Successful!" });
    } else {
      console.log("Incorrect username and password");
      JSAlert.alert("Incorrect username and password");
      res.render("backend/adminLogin", {
        error: "Incorrect username and password!",
      });
    }
    //  res.end();
  } else {
    console.log("Please enter Username and password");
    res.render("backend/adminLogin", {
      error: "Please enter Username and Password!",
    });
    // res.end();
  }
});

router.get("/admin", function (req, res, next) {
  res.render("backend/index", { title: "Admin Site" });
});
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/adminLogin");
});
router.get("/addBlog/", (req, res) => {
  res.render("backend/addBlog", { title: "Add Blog" });
});

router.post("/addBlog/", urlencodedparser, (req, res) => {
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
        title: "List Blog",
        list: docs,
      });
    } else {
      console.log("Error in retrieving employee list :" + err);
    }
  });
});

router.get("/inquiry", (req, res) => {
  contactModel.find((err, docs) => {
    if (!err) {
      console.log("record find");
      res.render("backend/inquiry", {
        title: "Inquiry",
        message: docs,
      });
    } else {
      console.log("Record not found");
    }
  });
});

router.get("/inquiry/delete/:id", (req, res) => {
  var selectedId = req.params.id;
  var filter = { _id: ObjectID(selectedId) };
  contactModel.deleteOne(filter, (err, d) => {
    if (!err) {
      console.log("record deleted");
      // res.render("backend/inquiry");
      res.redirect("/inquiry");
    } else {
      console.log("error delere record");
    }
  });
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About", success: " " });
});
router.get("/blogSingle", (req, res) => {
  res.render("blogSingle", { title: "Single Blog" });
});
router.get("/blogSingle/:id", (req, res) => {
  let selectedId = req.params.id;
  let filter = { _id: ObjectID(selectedId) };
  console.log("filter", filter);
  var query = commentModel.aggregate([
    // Join with user_info table
    {
      $lookup: {
        from: "blogmodels", // other table name
        localField: "blogID", // name of users table field
        foreignField: "_id", // name of userinfo table field
        as: "comment_info", // alias for userinfo table
      },
    },
    { $unwind: "$comment_info" }, // $unwind used for getting data in object or for one record only

    //  define some conditions here
    {
      $match: {
        $and: [{ blogId: filter }],
      },
    },

    // define which fields are you want to fetch
    {
      $project: {
        // _id : 1,
        //nemail : 1,
        name: 1,
        message: 1, //"$user_info.phone",
        // role : "$user_role.role",
      },
    },
  ]);
  query.exec((err, result) => {
    if (!err) {
      console.log("r", result);
    } else {
      console.log("err", err);
    }
  });

  commentModel.find(
    {
      $where: () => {
        console.log("id..........", this.blogID, filter);
        return this.blogID == filter;
      },
    },
    (err, docs) => {
      if (!err) {
        c = docs;
        let count = c.length;
        blogModel.findById(filter, (err, doc) => {
          if (!err) {
            res.render("blogSingle", {
              title: "Blog",
              blogModel: doc,
              comment: c,
              commentCount: count,
            });
          } else {
            console.log("error ", err);
          }
        });
      } else {
        console.log("error finding record", err);
      }
    }
  );
});

router.get("/blogGrid", (req, res) => {
  blogModel.find((err, docs) => {
    if (!err) {
      res.render("blogGrid", {
        list: docs,
      });
    }
  });
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

router.post("/blogSingle/:id/comment", urlencodedparser, (req, res) => {
  let bId = req.params.id;
  console.log(bId);
  console.log(req.body);

  let data = {
    blogID: req.params.id,
    name: req.body.name,
    email: req.body.email,
    website: req.body.website,
    message: req.body.message,
  };
  commentModel.create(data, (err, docs) => {
    if (!err) {
      console.log("comment inserted" + docs);

      res.redirect("/blogSingle/" + bId);
    } else {
      console.log("error comment", err);
    }
  });
});

router.post("/contact", urlencodedparser, (req, res) => {
  let data = req.body;
  contactModel.create(data, (err, result) => {
    if (err) {
      console.log("Error inserting inquiry", err);
    } else {
      console.log("record inserted");
      res.render("about", { success: "Message has been sent successfully!" });
    }
  });
});

function message(docs) {
  let cr;
  commentModel.find((err, docs) => {
    if (!err) {
      cr = docs;
    } else {
      console.log("error finding record", err);
    }
  });

  return cr;
}

function insertRecord(req, res) {
  // let date = { date: new Date(Date.now()) };
  let data = {
    blogID: req.body.id,
    image: req.body.image,
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    date: new Date(Date.now()),
  };
  blogModel.create(data, (err, doc) => {
    if (!err) {
      console.log("data inserted");
      res.redirect("/listBlog");
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
    }
  });
}

module.exports = router;
