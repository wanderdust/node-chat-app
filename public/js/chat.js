let socket = io();


function scrollToBottom () {
  // Selectors
  let messages = jQuery('#messages');
  let newMessage = messages.children('li:last-child')
  // Heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', () => {
  // let params = jQuery.deparam(window.location.search);
  let params = {};

  params.user_id = sessionStorage.getItem('user_id');
  params.user_name = sessionStorage.getItem('user_name');
  params.room_id = sessionStorage.getItem('room_id');
  params.room_name = sessionStorage.getItem('room_name');
  params.user_token = sessionStorage.getItem('user_token');

  if (!params.user_id || !params.user_name || !params.room_id || !params.room_name || !params.user_token) {
    alert('You need to sign in to start chatting')
    window.location.href = '/';
  }


  socket.emit('join', params, (err, data) => {
    if (err) {
      window.location.href = '/';
      return alert(err)
    }
    console.log(data)
  })
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
})

// Make a mustache template!
socket.on('updateUserList', (users) => {
  let ol = jQuery('<ol></ol>');
  users.forEach( (user) => {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol)
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
  scrollToBottom();
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
  scrollToBottom();
})

jQuery('#message-form').on('submit', (e) => {
  e.preventDefault();

  let $messageTextBox = jQuery('[name=message]')

  socket.emit('createMessage', {
    text: $messageTextBox.val()
  }, () => {
    $messageTextBox.val('')
  })
})

let $locationButton = jQuery('#send-location');
$locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }

  $locationButton.attr('disabled', 'disabled').text('Sending location...')

  navigator.geolocation.getCurrentPosition((position) => {
    $locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, () => {
    $locationButton.removeAttr('disabled').text('Send location')
    alert('Unable to fetch location')
  })
})
