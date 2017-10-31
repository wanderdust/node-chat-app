let $room_form = jQuery('#room-form');
let $sign_in_toggle = jQuery('.sign-in-toggle');
let $create_account_toggle = jQuery('.create-account-toggle');

let toggle = {};

toggle.toggleForm = function toggleForms (form) {
  $room_form.removeClass('invisible');
  form.addClass('invisible');
};

toggle.createAccount = $create_account_toggle.on('click', () => {
  $log_in_form.addClass('invisible');
  $new_account_form.removeClass('invisible')
})

toggle.signIn = $sign_in_toggle.on('click', () => {
  $new_account_form.addClass('invisible')
  $log_in_form.removeClass('invisible');
})
