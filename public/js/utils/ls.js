function ls_sign_in (nameString, name, idString, id) {

  sessionStorage.setItem(nameString, name);
  sessionStorage.setItem(idString, id);
}

function ls_clear () {
  sessionStorage.clear();
}
