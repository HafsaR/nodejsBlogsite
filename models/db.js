// const mongoose = require("mongoose");

// mongoose.connect(
//   "mongodb://localhost:27017/BlogDB",
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   (err) => {
//     if (!err) {
//       console.log("MongoDB Connection Succeeded.");
//     } else {
//       console.log("Error in DB connection : " + err);
//     }
//   }
// );

// require("./blog.model");


const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config()

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGO_CONNECTION,{ useNewUrlParser: true } ,  err => {
    if(!err){console.log('Database connection successful.');}
    else{console.log('database connection error: ' + err);}
});

require("./blog.model");
