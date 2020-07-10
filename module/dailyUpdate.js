// nint code 
const mongoose = require('mongoose');

// user schema
const dailyUpdateSchema = mongoose.Schema({
    empId : {type:mongoose.Types.ObjectId,ref:'employees'},
    taskName : {type:String,require:true},
    // description : String,
    // assigner : {type:mongoose.Types.ObjectId,ref:'employees'},
    // reviewer : {type:mongoose.Types.ObjectId,ref:'employees'},
    taskType :{type:mongoose.Types.ObjectId,ref:'taskType'},
    UpdatedOn : {type:Date,default:Date.now()},
    spendsHourOnTask : String,
    taskStatus : {type:mongoose.Types.ObjectId,ref:'taskStatus'},
    empComments : {type:String, default:'NA'},
    // taskAssignerComments : {type:String, default:'NA'},
    // taskReviewerComments : {type:String, default:'NA'},
    taskFiles : { type : String, default:null }
});


// user model
// mongoose.model('', adminSchema);

// module export
module.exports = mongoose.model( 'dailyUpdateModel', dailyUpdateSchema, 'dailyUpdate');