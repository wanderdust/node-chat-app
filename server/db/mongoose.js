let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGDODB_URI, {useMongoClient: true});

module.exports = {mongoose}
