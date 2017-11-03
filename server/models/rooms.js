let mongoose = require('mongoose');

let RoomSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  body: [{
    is: String,
    from: String,
    text: String,
    createdAt: Number
  }]
});

let Room = mongoose.model('Room', RoomSchema);

module.exports = {Room};
