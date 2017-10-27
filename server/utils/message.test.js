let expect = require('expect');

let {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    let message = generateMessage('pablo', 'hello');

    expect(message).toBeAn('object');
    expect(message).toInclude({
      from: 'pablo',
      text: 'hello'
    });
    expect(message.createdAt).toBeA('number');
  })
})

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    let message = generateLocationMessage('Admin', 1, 2);

    expect(message).toBeAn('object');
    expect(message.url).toBe('https://www.google.com/maps?q=1,2');
    expect(message.createdAt).toBeA('number')
  })
})
