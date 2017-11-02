require('./config/config.js');

let {mongoose} = require('./db/mongoose');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const http = require('http');

const {Users} = require('./utils/users')
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {User} = require('./models/users');
const {Room} = require('./models/rooms');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(bodyParser.json());

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {

    // Verify user
    User.findByToken(params.user_token).then((usr) => {
      if (!usr) {
        callback('User not verified')
        console.log('User not verified')
      }
    }).then(() => {
      socket.join(params.room_name);
      users.removeUser(socket.id); //Update?
      users.addUser(socket.id, params.user_name, params.room_name, params.user_token)

      io.to(params.room_name).emit('updateUserList', users.getUserList(params.room_name))
      socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
      socket.broadcast.to(params.room_name).emit('newMessage', generateMessage('Admin', `${params.user_name} has joined`));

      callback(null, 'User verified');
    }).catch((e) => callback(e));
  })

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
          io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  })

  socket.on('createLocationMessage', (coords) =>  {
    let user = users.getUser(socket.id)

    if(user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
    }
  })

  socket.on('newUser', (userData, callback) => {
    let user = {
      email: userData.email,
      password: userData.password
    }

    let newUserModel = new User(user);

    return newUserModel.save().then((usr) => {
      return usr.generateAuthToken();
    }).then((token) => {
      callback(null, user, token)
    }).catch((e) => {
      callback(e)
    })
  })

  socket.on('login', (userData, callback) => {
    let tmp_user;

    User.findByCredentials(userData.email, userData.password).then((user) => {

      tmp_user = user;
      return user.generateAuthToken()
    }).then((token) => {
      callback(null, tmp_user, token)
    }).catch(e => {
      callback(e)
      console.log(e)
    })
  })

  socket.on('existingRoom', (room, callback) => {
    Room.findOne({name: room.name}).then((data) => {
      if (!data) {
        return callback(`Room: "${room.name}", doesn't exist`);
      }
      callback(null, data)
    }).catch(e => callback(e))
  })

  socket.on('newRoom', (roomData, callback) => {
    let newRoom = new Room(roomData);

    newRoom.save().then((data) => {
      callback(null, data)
    }).catch(e => callback(e))
  })

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));

      User.findByToken(user.token).then((userDoc) => {
        if (!user)
          return Promise.reject('Could not remove token from user');

        return userDoc.removeToken(userDoc.tokens[0].token);
      }).catch((e) => {
        console.log(e)
      })
    };


  })
})

server.listen(port, () => {
  console.log(`Server is up in port ${port}`)
})
