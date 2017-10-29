const expect = require('expect');

let {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    let nonString = isRealString(undefined);
    expect(nonString).toBe(false)
  });

  it('should reject strings with only spaces', () => {
    let emtpyString = isRealString('    ');
    expect(emtpyString).toBe(false)
  });

  it('should allow string with non-space characters', () => {
    let string = isRealString('  node  ');
    expect(string).toBe(true)
  })
})
