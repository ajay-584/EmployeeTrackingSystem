// nint code 
const mongoose = require('mongoose');

// user schema
const empSchema = mongoose.Schema({
    createdOn : {type: Date, default : Date.now() },
    email: String,
    password : String,
    name : String,
    empId : { type : mongoose.Types.ObjectId, ref: 'employees'}
});


// user model
// mongoose.model('', adminSchema);

// module export
module.exports = mongoose.model('empModel',empSchema,'empLogin');