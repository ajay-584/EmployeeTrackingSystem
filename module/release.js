// nint code 
const mongoose = require('mongoose');

// user schema
const releaseSchema = mongoose.Schema({
    releaseName: String,
    inserOn: {
        type: Date,
        default: Date.now()
    }
});


// user model
// mongoose.model('', adminSchema);

// module export
module.exports = mongoose.model('releaseModel',releaseSchema,'release');