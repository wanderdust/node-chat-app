let {mongoose} = require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const {Users} = require('./utils/users')
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;

let {User} = require('./models/users');
let {Room} = require('./models/rooms');

let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(bodyParser.json());

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id); //Update?
    users.addUser(socket.id, params.name, params.room)

    io.to(params.room).emit('updateUserList', users.getUserList(params.room))
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    callback()
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
    let user = new User(userData);

    user.save().then((usr) => {
      callback(null, usr)
    }).catch(e => callback(e))
  })

  socket.on('login', (userData, callback) => {
    User.findOne({
      email: userData.email,
      password: userData.password
    }).then((user) => {
      if (!user) {
        return callback('No user found')
      }
      callback(null, user)
    }).catch(e => callback(e))
  })

  socket.on('existingRoom', (room, callback) => {
    Room.findOne({name: room.name}).then((data) => {
      if (!data) {
        return callback('No room found');
      }
      callback(null, data)
    }).catch(e => callback(e))
  })

  socket.on('newRoom', (roomData, callback) => {
    let room = new Room(roomData);

    room.save().then((data) => {
      callback(null, data)
    }).catch((e) => callback(e))
  })

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  })
})

server.listen(port, () => {
  console.log(`Server is up in port ${port}`)
})
