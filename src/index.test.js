const { expect } = require('chai');
const { multiply, double, readPackageJson } = require('./index');

describe('Dummy test', () => {
  it('should test dummy multiplier', () => {
    expect(multiply(2, 3)).to.equal(6);
  });
  it('should double the input number', () => {
    expect(double(4)).to.equal(8);
  });
  it('should print the package.json', done => {
    readPackageJson((err, response) => {
      expect(JSON.parse(response)).to.include.keys([
        'name',
        'version',
        'scripts'
      ]);
      done();
    });
  });
});
