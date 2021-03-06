const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let secret = process.env.JWT_SECRET;

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
  let token = jwt.sign({_id: user._id.toHexString(), access}, secret)

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  })
}

UserSchema.methods.removeToken = function (token) {
  let user = this;

  if (user.tokens[0].token !== token)
    return Promise.reject('Tokens are not the same')

  return user.update({
    $pull: {
      tokens: {token}
    }
  })
}

UserSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, secret);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject('No user found');
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject("Wrong password");
        }
      })
    })
  })
};



UserSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
})

let User = mongoose.model('User', UserSchema)

module.exports = {User}
