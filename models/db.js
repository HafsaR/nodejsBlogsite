// const MongoClient = require("mongodb").MongoClient;
// const uri =
//   "mongodb+srv://mongo:mongo@cluster0-xq7df.mongodb.net/BlogDB?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err) => {
//   if (!err) {
//     console.log("database connected");

//     // perform actions on the collection object
//     // client.close();
//   } else {
//     console.log("Error connectind Database" + err);
//   }
// });
// require("./blog.model");

const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/BlogDB",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection : " + err);
    }
  }
);

require("./blog.model");
