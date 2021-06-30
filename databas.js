// // nint code
// const mongoose = require('mongoose');
// const assert = require('assert');
// const db_url = process.env.DB_URL;



// // connetion code
// mongoose.connect(
//     db_url,
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true
//     },
//     function (err, link) {
//         // check errr
//         assert.equal(err, null, 'Database connection fail....');
//         // if everything is ok
//         console.log("Database connected...");
//     }
// );



const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ajay:ajay@cluster0.i1mg7.mongodb.net/EmpTracker?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log("database is connected");
  // perform actions on the collection object
  client.close();
});
