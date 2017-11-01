const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

let UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim:true,
    minlength: 1,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.generateAuthToken = function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'secret123')

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  })
}

let User = mongoose.model('User', UserSchema)

module.exports = {User}
