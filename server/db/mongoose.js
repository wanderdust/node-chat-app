let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/chatApp', {useMongoClient: true});

module.exports = {mongoose}
