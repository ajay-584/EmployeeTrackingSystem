// // nint code
// const mongoose = require('mongoose');
// const db_url = process.env.DB_URL;
// const local_db = process.env.LOCAL_DB;



// // connetion code
// const db = async ()=>{
//  await mongoose.connect(local_db, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: true,
//   useCreateIndex: true
// }).then((rel)=>{
//     console.log("db is connected");
// }).catch((e)=>{
//     console.log("there is error in db connected");
// });

// }


// db();



const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ajay:ajay@1999@cluster0.rfk5e.mongodb.net/Test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
