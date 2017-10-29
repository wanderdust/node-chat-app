const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: 1,
      name: 'mike',
      room: 'node course'
    }, {
      id: 2,
      name: 'Billy',
      room: 'Buffalos'
    }, {
      id: 3,
      name: 'jabadoo',
      room: 'node course'
    }]
  })

  it('should add new user', () => {
    let users = new Users();

    let user = {
      id: 123,
      name: 'billy',
      room: 'the joes'
    };
    let resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user])
  })

  it('should remove a user', () => {
    let user = users.removeUser(2);

    expect(user.id).toBe(2);
    expect(users.users.length).toBe(2);
    expect(users.users).toEqual([{
      id: 1,
      name: 'mike',
      room: 'node course'
    }, {
      id: 3,
      name: 'jabadoo',
      room: 'node course'
    } ])
  });

  it('should not remove user', () => {
    let user = users.removeUser(1321321);

    expect(users.users.length).toBe(3);
    expect(user).toNotExist()
  });

  it('should find user', () => {
    let user = users.getUser(3);
    expect(user.id).toBe(3)
  });

  it('should not find user', () => {
    let user = users.getUser(54654654);
    expect(user).toBe(undefined)
  })

  it('should return names for node course', () => {
    let userList = users.getUserList('node course');

    expect(userList).toEqual(['mike', 'jabadoo'])
  })

  it('should return names for Buffalos', () => {
    let userList = users.getUserList('Buffalos');

    expect(userList).toEqual(['Billy'])
  })
})
