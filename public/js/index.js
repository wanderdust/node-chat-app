let socket = io();

let $log_in_form = jQuery('#log-in-form');
let $new_account_form = jQuery('#new-account-form');
let $sign_in_toggle = jQuery('.sign-in-toggle');
let $create_account_toggle = jQuery('.create-account-toggle')


socket.on('connect', () => {

  $log_in_form.on('submit', (e) => {
    e.preventDefault();

    let $email = jQuery('[name=user]').val();
    let $password = jQuery('#password').val();

    socket.emit('login', {
      email: $email,
      password: $password
    })
  })


  $new_account_form.on('submit', (e) => {
    e.preventDefault();

    let $email = jQuery('[name=new-user]').val();
    let $password = jQuery('#new-password').val();

    socket.emit('newUser', {
      email: $email,
      password: $password
    })
  })
});



$create_account_toggle.on('click', () => {
  $log_in_form.addClass('invisible');
  $new_account_form.removeClass('invisible')
})

$sign_in_toggle.on('click', () => {
  $new_account_form.addClass('invisible')
  $log_in_form.removeClass('invisible');
})
