const mongoose = require("mongoose");

var blogSchema = mongoose.Schema({
  image: {
    //add directory
  },
  author: {
    type: String,
  },
  category: {
    type: String,
  },
  title: {
    type: String,
    require: "required",
  },
  description: {
    type: String,
    require: "required",
  },
  date: {},
});

var adminSchema = mongoose.Schema({
  username: {
    type: String,
    // require: "username is required",
  },
  password: {
    type: String,
    //require: "password is required",
  },
});

var commentSchema = mongoose.Schema({
  blogID: {},
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  message: {
    type: String,
  },
});

var contactSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
});
module.exports = {
  blogModel: mongoose.model("blogModel", blogSchema),
  adminModel: mongoose.model("adminLogin", adminSchema),
  commentModule: mongoose.model("commentModel", commentSchema),
  contactModule: mongoose.model("contactModule", contactSchema),
};
