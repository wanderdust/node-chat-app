let env = process.env.NODE_ENV || 'development';

const config = require('./config.json');

console.log('*******', env)

if (env === 'development') {
  process.env.PORT = config.development.PORT;
  process.env.MONGOLAB_URI = config.development.MONGOLAB_URI;
  process.env.JWT_SECRET = config.development.JWT_SECRET
} else if (env === 'test') {
  process.env.PORT = config.test.PORT;
  process.env.MONGOLAB_URI = config.test.MONGOLAB_URI;
  process.env.JWT_SECRET = config.test.JWT_SECRET;
}
