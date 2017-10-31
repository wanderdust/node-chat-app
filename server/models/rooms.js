let mongoose = require('mongoose');

let RoomSchema = mongoose.Schema({
  name: {type: String, required: true},
  body: [{
    text: String,
    from: String,
    createdAt: Number
  }]
});

let Room = mongoose.model('Room', RoomSchema);

module.exports = {Room};


//For testing --->>>

// let newRoom = new Room({
//   name: "room1",
//   id: "room1",
//   body: [{
//     text: 'Welcome to the app',
//     from: 'Pablo',
//     createdAt: 1234
//   }]
// })
//
// newRoom.save().then((doc) => {
//   console.log('Saved todo', doc)
// }).catch(e => console.log('unable to save todo'))
