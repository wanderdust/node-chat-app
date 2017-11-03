let socket = io();

let $log_in_form = jQuery('#log-in-form');
let $new_account_form = jQuery('#new-account-form');
let $room_button = jQuery('#room-button');
let $new_room_button = jQuery('#new-room-button');
let $new_room_input = jQuery('[name=new-room]');

//Event listeners to hide/show forms
toggle.createAccount;
toggle.signIn;


socket.on('connect', () => {

  //Clear storage data if exists
   ls_clear();

  $log_in_form.on('submit', (e) => {
    let $email = jQuery('[name=user]').val();
    let $password = jQuery('#password').val();

    e.preventDefault();

    socket.emit('login', {
      email: $email,
      password: $password
    }, (err, data, token) => {
      if (err) {
        return alert(err)
      }
      toggle.toggleForm($log_in_form);

      ls_sign_in("user_name", data.email, "user_id", data._id);
      sessionStorage.setItem('user_token', token)
    })
  })


  $new_account_form.on('submit', (e) => {
    let $email = jQuery('[name=new-user]').val();
    let $password = jQuery('#new-password').val();

    e.preventDefault();

    socket.emit('newUser', {
      email: $email,
      password: $password
    }, (err, data, token) => {
      if (err) {
        if (err.code === 11000) {
          return alert('Error: user name already exists')
        }

        return alert(err)
      }
      toggle.toggleForm($new_account_form);
      ls_sign_in("user_name", data.email, "user_id", data._id);
      sessionStorage.setItem('user_token', token);
    })
  })

  $room_button.on('click', (e) => {
    let $existingRoom = jQuery('[name=room]').val().trim();

    e.preventDefault();

    socket.emit('existingRoom', {
      name: $existingRoom
    }, (err, data) => {
      if (err)
        return alert(err)

      ls_sign_in("room_name", data.name, "room_id", data._id);
      window.location.href = '/chat.html';
    })

  })

  $new_room_button.on('click', (e) => {
    let $newRoom = jQuery('[name=new-room]').val().trim();

    e.preventDefault();

    socket.emit('newRoom', {
      name: $newRoom
    }, (err, data) => {
      if (err) {
        if (err.code === 11000)
          return alert('Error: room name already exists')

        return alert(err.message)
      }
      window.location.href = '/chat.html';
      ls_sign_in("room_name", data.name, "room_id", data._id);
    })
  })

  $new_room_input.on('click', () => {
    $new_room_button.removeClass('invisible');
  })
});
