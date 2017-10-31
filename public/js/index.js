let socket = io();

let $log_in_form = jQuery('#log-in-form');
let $new_account_form = jQuery('#new-account-form');
let $room_button = jQuery('#room-button');
let $new_room_button = jQuery('#new-room-button')

//Event listeners to hide/show forms
toggle.createAccount;
toggle.signIn;


socket.on('connect', () => {

  $log_in_form.on('submit', (e) => {
    e.preventDefault();

    let $email = jQuery('[name=user]').val();
    let $password = jQuery('#password').val();

    socket.emit('login', {
      email: $email,
      password: $password
    }, (err, user) => {
      if (err) {
        return console.log('No user found')
      }
      //localStorage.setItem('user_name', user.email) -> instead of params
      //localStorage.setItem('room_name', $('[name=room]').val())
      console.log( `user ${user.email} found`);
      toggle.toggleForm($log_in_form);

    })
  })


  $new_account_form.on('submit', (e) => {
    e.preventDefault();

    let $email = jQuery('[name=new-user]').val();
    let $password = jQuery('#new-password').val();

    socket.emit('newUser', {
      email: $email,
      password: $password
    }, (err, user) => {
      if (err) {
        return console.log(err._message)
      }
      console.log(`user ${user.email} created`);
      toggle.toggleForm($new_account_form);

    })
  })

  $room_button.on('click', (e) => {
    e.preventDefault();

    let $existingRoom = jQuery('[name=room]').val().trim();

    socket.emit('existingRoom', {
      name: $existingRoom
    }, (err, data) => {
      if (err) {
        return console.log(err)
      }
      console.log(data)
    })

  })

  $new_room_button.on('click', (e) => {
    e.preventDefault();

    let $newRoom = jQuery('[name=new-room]').val().trim();

    socket.emit('newRoom', {
      name: $newRoom
    }, (err, data) => {
      if (err) {
        return console.log(err)
      }
      console.log(data)
    })

  })
});
