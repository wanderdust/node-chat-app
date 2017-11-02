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
};

// let params = jQuery.deparam(window.location.search);
let params = {};

params.user_id = sessionStorage.getItem('user_id');
params.user_name = sessionStorage.getItem('user_name');
params.room_id = sessionStorage.getItem('room_id');
params.room_name = sessionStorage.getItem('room_name');
params.user_token = sessionStorage.getItem('user_token');

socket.on('connect', () => {

  if (!params.user_id || !params.user_name || !params.room_id || !params.room_name || !params.user_token) {
    alert('You need to sign in to start chatting')
    window.location.href = '/';
  }


  socket.emit('join', params, (err, room) => {
    if (err) {
      window.location.href = '/';
      return alert(err)
    }

    // Renders saved messages once the user has been verified
    room.body.forEach((message) => {
      let template;

      if (message.is === "message") {
        template = jQuery('#message-template').html();
      } else if (message.is === "location") {
        template = jQuery('#location-message-template').html();
      }
      renderTemplate(template, message);
    })
  })
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Make a mustache template!
socket.on('updateUserList', (users) => {
  let ol = jQuery('<ol></ol>');
  users.forEach( (user) => {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol)
});

socket.on('newMessage', (message) => {
  let template = jQuery('#message-template').html();
  renderTemplate(template, message);
});

socket.on('newLocationMessage', (message) => {
  let template = jQuery('#location-message-template').html();
  renderTemplate(template, message);
});

jQuery('#message-form').on('submit', (e) => {
  e.preventDefault();

  let $messageTextBox = jQuery('[name=message]')

  socket.emit('createMessage', {
    text: $messageTextBox.val(),
    room_id:params.room_id
  }, () => {
    $messageTextBox.val('')
  })
});

let $locationButton = jQuery('#send-location');
$locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }

  $locationButton.attr('disabled', 'disabled').text('Sending location...')

  navigator.geolocation.getCurrentPosition((position) => {
    $locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      room_id: params.room_id,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, () => {
    $locationButton.removeAttr('disabled').text('Send location')
    alert('Unable to fetch location')
  })
});
