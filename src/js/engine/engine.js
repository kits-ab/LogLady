const fileReader = require('../adapters/fileReader');

const readLines = fileReader
  .readLastLines('./src/myLittleFile.txt', 10)
  .then(lines => {
    console.log(lines);
    return lines;
  })
  .catch(err => {
    return err;
  });

module.exports = {
  readLines: readLines
};
