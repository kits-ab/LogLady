const fileReader = require('../adapters/fileReader');

const readLines = (filePath, numberOfLines) => {
  return new Promise((resolve, reject) => {
    fileReader
      .readLastLines(filePath, numberOfLines)
      .then(lines => {
        resolve(lines);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// readLines('src/resources/myLittleFile.txt', 10);

module.exports = {
  readLines: readLines
};
