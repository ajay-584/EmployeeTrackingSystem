// nint code 
const mongoose = require('mongoose');

// user schema
const skillSchema = mongoose.Schema({
    skillName: String,
    inserOn: {
        type: Date,
        default: Date.now()
    }
});


// user model
// mongoose.model('', adminSchema);

// module export
module.exports = mongoose.model('skillsModel',skillSchema,'skills');