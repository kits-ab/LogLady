const fileReader = require('../adapters/fileReader');

const readLines = () => {
  fileReader
    .readLastLines(
      '/Users/emmastalesjo/KITS/projekt/LogLady/src/resources/myLittleFile.txt',
      1
    )
    .then(lines => {
      console.log(lines);
      return lines;
    })
    .catch(err => {
      return err;
    });
};

readLines();

module.exports = {
  readLines: readLines
};
