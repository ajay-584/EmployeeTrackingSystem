// nint code
const mongoose = require('mongoose');
const assert = require('assert');
const db_url = process.env.DB_URL;

// connetion code
mongoose.connect(
    db_url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    function (err, link) {
        // check errr
        assert.equal(err, null, 'Database connection fail....');
        // if everything is ok
        console.log("Database connected...");
    }
);