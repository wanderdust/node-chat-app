let socket = io();

socket.on('connect', function () {
  console.log('Connected to server')

  socket.emit('createMessage', {
    from: "Monica",
    text: "this is Pabs"
  })
});

socket.on('disconnect', function () {
  console.log('Disconnected from server')
})

socket.on('newMessage', function (message) {
  console.log('New message', message)
});
