const fileReader = require('./fileReader');
const path = require('path');

it('reads a file and prints content to console', done => {
  fileReader
    .readFile('./src/resources/example.txt', 'utf8')
    .then(data => {
      expect(data).toBe('this is the content\n');
      done();
    })
    .catch(err => {
      console.log(err);
      done();
    });
});
