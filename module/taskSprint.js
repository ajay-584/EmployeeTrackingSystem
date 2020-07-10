// nint code 
const mongoose = require('mongoose');

// user schema
const taskSprintSchema = mongoose.Schema({
    sprintName: String,
    inserOn: {
        type: Date,
        default: Date.now()
    }
});


// user model
// mongoose.model('', adminSchema);

// module export
module.exports = mongoose.model('sprintModel',taskSprintSchema,'tasksprint');