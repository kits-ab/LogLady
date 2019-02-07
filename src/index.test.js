const {expect} = require('chai');
const {multiply} = require('./index');

describe('Dummy test', () => {
  it('should test dummy multiplier', () => {
    expect(multiply(2, 3)).to.equal(6);
  })
})