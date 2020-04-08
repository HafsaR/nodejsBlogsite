const mongoose = require("mongoose");

var blogSchema = mongoose.Schema({
  image: {
    //add directory
  },
  title: {
    type: String,
    require: "required",
  },
  description: {
    type: String,
    require: "required",
  },
});

var adminSchema = mongoose.Schema({
  username: {
    type: String
   // require: "username is required",
  },
  password: {
    type: String
    //require: "password is required",
  },
});

mongoose.model("blogModel", adminSchema, blogSchema);
