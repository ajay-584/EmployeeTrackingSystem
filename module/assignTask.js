// nint code 
const mongoose = require('mongoose');

// user schema
const assignTaskSchema = mongoose.Schema({
    taskName : {type:String,require:true},
    taskDesc : String,
    taskRelease : {type:mongoose.Types.ObjectId,ref:'release'},
    taskSprint : {type:mongoose.Types.ObjectId,ref:'tasksprint'},
    taskType : {type:mongoose.Types.ObjectId,ref:'taskType'},
    assignBy : {type:mongoose.Types.ObjectId,ref:'employee'},
    assignTo : {type: mongoose.Types.ObjectId, ref: 'employees' },
    startDate : Date,
    dueDate : Date,
    taskHourNeed : String,
    taskId : String,
    taskReviewer : {type:mongoose.Types.ObjectId,ref:'employees'},
    taskNotes : String,
    taskFiles : { type : String, default:null }
});


// user model
// mongoose.model('', adminSchema);

// module export
module.exports = mongoose.model( 'adminModel', assignTaskSchema, 'assignTask');