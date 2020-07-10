// init code 
const mongoose = require('mongoose');

// creating schema
const updateAssignTaskSchema = mongoose.Schema({
    updatedOn : { type : Date, default : Date.now()},
    taskStatus : { type : mongoose.Types.ObjectId, ref:'taskStatus'},
    taskId : {type : mongoose.Types.ObjectId, ref : 'assignTask'},
    empId : { type : mongoose.Types.ObjectId, ref: 'assignTask' },
    HourSpendOnTask : Number,
    file : String,
    empComment : String,
    assignerComment : String,
    reviewerComment : String
});

module.exports = mongoose.model('updateAssignTaskModel', updateAssignTaskSchema, 'updatedAssignTask');