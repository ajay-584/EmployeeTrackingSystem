// nint code 
const mongoose = require('mongoose');

// user schema
const designationSchema = mongoose.Schema({
    designationName: String,
    inserOn: {
        type: Date,
        default: Date.now()
    }
});

// user schema
// const releaseSchema = mongoose.Schema({
//     releaseName: String,
//     inserOn: {
//         type: Date,
//         default: Date.now()
//     }
// });
// user model
// mongoose.model('', adminSchema);

module.exports = mongoose.model('desiganationModel', designationSchema,'designation');

// var asldk = mongoose.model('desiganationModel', designationSchema,'designation');
// var laskd= module.exports = mongoose.model('releaseModel',releaseSchema,'release');

// module.exports= {
//  desiganationModel :  mongoose.model('desiganationModel', designationSchema,'designation'),
//  adminLOgin :  mongoose.model('desiganationModel', designationSchema,'designation'),
// };