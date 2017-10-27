let socket = io();

socket.on('connect', () => {
  console.log('Connected to server')
});

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

socket.on('newMessage', (message) => {
  let formattedTime = moment(message.createdAt).format('h:mm a')
  let template = jQuery('#message-template').html();
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html)
});

socket.on('newLocationMessage', (message) => {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = jQuery('#location-message-template').html();
  let html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
})

jQuery('#message-form').on('submit', (e) => {
  e.preventDefault();

  let $messageTextBox = jQuery('[name=message]')

  socket.emit('createMessage', {
    from: 'User',
    text: $messageTextBox.val()
  }, () => {
    $messageTextBox.val('')
  })
})

let locationButton = jQuery('#send-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...')

  navigator.geolocation.getCurrentPosition((position) => {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, () => {
    locationButton.removeAttr('disabled').text('Send location')
    alert('Unable to fetch location')
  })
})
