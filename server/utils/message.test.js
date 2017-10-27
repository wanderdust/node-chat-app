let expect = require('expect');

let {generateMessage} = require('./message')

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
