let env = process.env.NODE_ENV || 'development';

console.log('*******', env)

if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGDODB_URI = 'mongodb://localhost:27017/chatApp',
  process.env.JWT_SECRET = "aldkje73ng84n484n4lkj6"
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGDODB_URI = 'mongodb://localhost:27017/chatAppTest',
  process.env.JWT_SECRET = "sdh49m8r7w9r8h4s6d5f4g"
}
