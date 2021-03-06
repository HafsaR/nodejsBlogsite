require("../models/db");
const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongoose = require("mongoose");
const session = require("express-session");
const ObjectID = require("mongodb").ObjectID;
const path = require("path");
const fs = require("fs");

// var multer = require("multer");

// var storage = multer.diskStorage({
//   destination: "./public/uploads/",
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// const uploads = multer({
//   storage: storage,
// }).single("image");

// const handleError = (err, res) => {
//   res.status(500).contentType("text/plain").end("Oops! Something went wrong!");
// };

const blogModel = require("../models/blog.model").blogModel;
const adminModel = require("../models/blog.model").adminModel;
const commentModel = require("../models/blog.model").commentModule;
const contactModel = require("../models/blog.model").contactModule;

router.get("/", (req, res) => {
  var query = blogModel.find().sort({_id:-1 }).limit(3);
  query.exec((err, result) => {
    if (!err) {
      res.render("index", { title: "Blog site", blogModel: result });
    } else {
      console.log("error", err);
    }
  });
});
router.get("/adminLogin", (req, res) => {
  if (req.session.loggedin) {
    res
      .status(200)
      .render("backend/index", { title: "Admin Login", error: " " });
  } else {
    res
      .status(200)
      .render("backend/adminLogin", { title: "Admin Login", error: " " });
  }
});

router.post("/auth", (req, res) => {
  if (req.session.loggedin) {
    res.render("backend/index", { success: "Login Successful!" });
  }
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    if (username == "admin" && password == "admin") {
      req.session.loggedin = true;
      (req.session.username = "admin"),
        res.render("backend/index", { success: "Login Successful!" });
    } else {
      res.render("backend/adminLogin", {
        error: "Incorrect username and password!",
      });
    }
  } else {
    res.render("backend/adminLogin", {
      error: "Please enter Username and Password!",
    });
  }
});

router.get("/admin", function (req, res, next) {
  if (req.session.loggedin) {
    res.render("backend/index", { title: "Admin Site" });
  } else {
    res.render("backend/adminLogin", {
      title: "Admin Site",
      error: "Please Login",
    });
  }
});
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/adminLogin");
});
router.get("/addBlog/", (req, res) => {
  if (req.session.loggedin) {
    res.render("backend/addBlog", { title: "Admin Site" });
  } else {
    res.render("backend/addBlog", { title: "Admin Site" });
  }
});

router.post("/addBlog/", urlencodedParser, (req, res) => {
  let data = {
    blogID: req.body.id,
    image: req.body.image,
    category: req.body.category,
    author: req.body.author,
    title: req.body.title,
    description: req.body.description,
    date: new Date(Date.now()),
  };
  console.log("d", data);
  blogModel.create(data, (err, doc) => {
    if (!err) {
      console.log("data inserted");
      res.redirect("/listBlog");
    } else {
      console.log("error during data insert" + err);
    }
  });
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

  commentModel.find((err, docs) => {
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
  });
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

router.post("/blogSingle/:id/comment", urlencodedParser, (req, res) => {
  let bId = req.params.id;
  console.log(bId);
  console.log(req.body);

  let data = {
    blogID: req.params.id,
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    date: new Date(Date.now()),
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

router.post("/contact", urlencodedParser, (req, res) => {
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
  let data = {
    blogID: req.body.id,
    image: req.body.image,
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    date: new Date(Date.now()),
  };
  console.log("d", data);
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
