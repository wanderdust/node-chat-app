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
    if (!isRealString(params.user_name) || !isRealString(params.room_name)) {
      return callback('Name and room are required.');
    }

    socket.join(params.room_name);
    users.removeUser(socket.id); //Update?
    users.addUser(socket.id, params.user_name, params.room_name)

    io.to(params.room_name).emit('updateUserList', users.getUserList(params.room_name))
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room_name).emit('newMessage', generateMessage('Admin', `${params.user_name} has joined`));
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
    let user = {
      email: userData.email,
      password: userData.password
    }

    let newUserModel = new User(user);

    return newUserModel.save().then((usr) => {
      return usr.generateAuthToken();
    }).then((token) => {
      callback(null, user, token)
    }).catch((e) => callback(e))
  })

  socket.on('login', (userData, callback) => {
    User.findOne({
      email: userData.email,
      password: userData.password
    }).then((user) => {
      if (!user) {
        return callback('Error: invalid user or password')
      }
      callback(null, user)
    }).catch(e => callback(e))
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
    }
  })
})

server.listen(port, () => {
  console.log(`Server is up in port ${port}`)
})
