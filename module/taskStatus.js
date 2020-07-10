// nint code 
const mongoose = require('mongoose');

// user schema
const taskStatusSchema = mongoose.Schema({
    StatusName: String,
    insertOn: {
        type: Date,
        default: Date.now()
    }
});


// user model
// mongoose.model('', adminSchema);

// module export
module.exports = mongoose.model('taskStatusModel',taskStatusSchema,'taskStatus');