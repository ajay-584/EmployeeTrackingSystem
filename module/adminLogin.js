// nint code 
const mongoose = require('mongoose');

// user schema
const adminLoginSchema = mongoose.Schema({
    createdOn : {type: Date, default : Date.now() },
    email: String,
    password: String
});


// user model
// mongoose.model('', adminSchema);

// module export
module.exports = mongoose.model('adminLognmodel',adminLoginSchema,'adminLogin');