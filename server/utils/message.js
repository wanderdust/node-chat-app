let moment = require('moment');

let generateMessage = (from, text) => {
  return {
    is: "message",
    from,
    text,
    createdAt: moment().valueOf()
  }
};

let generateLocationMessage = (from, lat, lng) => {
  return {
    is: "location",
    from,
    text: `https://www.google.com/maps?q=${lat},${lng}`,
    createdAt: moment().valueOf()
  }
}

module.exports = {
  generateMessage,
  generateLocationMessage
}
