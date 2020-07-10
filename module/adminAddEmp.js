// nint code 
const mongoose = require('mongoose');

// user schema
const adminAddEmpSchema = mongoose.Schema({
    name : String,
    phoneNo : Number,
    email : String,
    gender : String,
    designation : {type:mongoose.Types.ObjectId,ref:'designation'},
    primarySkill : {type:mongoose.Types.ObjectId,ref:'skills'},
    secondarySkill : {type:mongoose.Types.ObjectId,ref:'skills'},
    joinDate : Date,
    workHour : Number
});


// user model
// mongoose.model('', adminSchema);

// module export
module.exports = mongoose.model('adminAddEmpModel',adminAddEmpSchema,'employees');