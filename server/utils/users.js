class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room, token) {
    let user = {id, name, room, token};
    this.users.push(user);
    return user;
  }

  removeUser (id) {
    let removedUser = this.getUser(id);

    if (removedUser) {
      let updatedArray = this.users.filter((user) => user.id !== id);
      this.users = updatedArray;
    }
    return removedUser;
  }

  getUser (id) {
    let user = this.users.filter((usr) => usr.id === id);
    return user[0];
  }

  getUserList (room) {
    let users = this.users.filter((user) => user.room === room);
    let namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = {Users}
