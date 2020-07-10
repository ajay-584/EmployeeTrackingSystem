// nint code 
const mongoose = require('mongoose');

// user schema
const taskTypeSchema = mongoose.Schema({
    taskName: String,
    insertOn: {
        type: Date,
        default: Date.now()
    }
});


// user model
// mongoose.model('', adminSchema);

// module export
module.exports = mongoose.model('taskTypeModel',taskTypeSchema,'taskType');