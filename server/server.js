require('./config/config.js');
let {mongoose} = require('./db/mongoose');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const http = require('http');
const {ObjectID} = require('mongodb');

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

      //returns the current room to load conversations
      return Room.findById(params.room_id)
    }).then((room) => {
      if (!room)
        return Promise.reject('room not found')

      callback(null, room)
    }).catch((e) => callback(e));
  })

  socket.on('createMessage', (messageData, callback) => {
    let user = users.getUser(socket.id);
    let message = generateMessage(user.name, messageData.text)

    // Saves message in the Room model and then sends them back.
    if (user && isRealString(messageData.text)) {
      Room.findByIdAndUpdate(
        messageData.room_id,
        {
          $push: {
            body: message
          }
      }, {
        new: true
      }).then((room) => {
        io.to(room.name).emit('newMessage', room.body[room.body.length - 1])
      }).catch(e => console.log(e))
    }
    callback();
  })

  socket.on('createLocationMessage', (messageData) =>  {
    let user = users.getUser(socket.id);
    let locationMessage = generateLocationMessage(user.name, messageData.latitude, messageData.longitude);

    if(user) {
      Room.findByIdAndUpdate(
        messageData.room_id,
        {
          $push: {
            body: locationMessage
          }
      }, {
        new: true
      }).then((room) => {
        io.to(room.name).emit('newLocationMessage', room.body[room.body.length - 1])
      })

      //io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, messageData.latitude, coords.longitude))
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
