let socket = io();

let $log_in_form = jQuery('#log-in-form');
let $new_account_form = jQuery('#new-account-form');
let $room_button = jQuery('#room-button');
let $new_room_button = jQuery('#new-room-button')

//Event listeners to hide/show forms
toggle.createAccount;
toggle.signIn;


socket.on('connect', () => {

  //Clear storage data if exists
   ls_sign_out();

  $log_in_form.on('submit', (e) => {
    e.preventDefault();

    let $email = jQuery('[name=user]').val();
    let $password = jQuery('#password').val();

    socket.emit('login', {
      email: $email,
      password: $password
    }, (err, data) => {
      if (err) {
        return alert(err)
      }

      console.log( `user ${data.email} found`);
      toggle.toggleForm($log_in_form);

      ls_sign_in("user_name", data.email, "user_id", data._id);
    })
  })


  $new_account_form.on('submit', (e) => {
    e.preventDefault();

    let $email = jQuery('[name=new-user]').val();
    let $password = jQuery('#new-password').val();

    socket.emit('newUser', {
      email: $email,
      password: $password
    }, (err, data, token) => {
      if (err) {
        if (err.code === 11000) return alert('Error: user name already exists')
        console.log(err)
        return alert(err)
      }
      console.log('token:', token)
      console.log(`user ${data.email} created`);
      toggle.toggleForm($new_account_form);

      ls_sign_in("user_name", data.email, "user_id", data._id);
      sessionStorage.setItem('user_token', token);
    })
  })

  $room_button.on('click', (e) => {
    e.preventDefault();

    let $existingRoom = jQuery('[name=room]').val().trim();

    socket.emit('existingRoom', {
      name: $existingRoom
    }, (err, data) => {
      if (err) {
        return alert(err)
      }
      console.log(data)
      ls_sign_in("room_name", data.name, "room_id", data._id);
      window.location.href = '/chat.html';
    })

  })

  $new_room_button.on('click', (e) => {
    e.preventDefault();

    let $newRoom = jQuery('[name=new-room]').val().trim();

    socket.emit('newRoom', {
      name: $newRoom
    }, (err, data) => {
      if (err) {
        if (err.code === 11000) return alert('Error: room name already exists')

        return alert(err)
      }
      console.log(data)
      window.location.href = '/chat.html';
      ls_sign_in("room_name", data.name, "room_id", data._id);
    })
  })
});
