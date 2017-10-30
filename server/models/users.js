let mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim:true,
    minlength: 1
  }
})

let User = mongoose.model('User', UserSchema)

module.exports = {User}
