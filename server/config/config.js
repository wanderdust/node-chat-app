let env = process.env.NODE_ENV || 'development';

const config = require('./config.json');

console.log('*******', env)

if (env === "production") {
  console.log(process.env.PORT )
  console.log(process.env.MONGDODB_URI)
  console.log(process.env.JWT_SECRET)
}else if (env === 'development') {
  process.env.PORT = config.development.PORT;
  process.env.MONGDODB_URI = config.development.MONGODB_URI;
  process.env.JWT_SECRET = config.development.JWT_SECRET
} else if (env === 'test') {
  process.env.PORT = config.test.PORT;
  process.env.MONGDODB_URI = config.test.MONGODB_URI;
  process.env.JWT_SECRET = config.test.JWT_SECRET;
}
