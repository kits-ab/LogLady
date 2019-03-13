const fileReader = require('./fileReader');

it('reads a file and prints content to console', () => {
  fileReader
    .readFile('./src/resources/example.txt', 'utf8')
    .then(data => {
      console.log(data);
      expect(data).toBe('this is the content');
    })
    .catch(err => {
      console.log(err);
    });
});
