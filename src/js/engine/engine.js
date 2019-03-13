const { fork } = require('child_process');
const { EventEmitter } = require('events');
const fileReader = require('../adapters/fileReader');

const events = new EventEmitter();

const readLines = (filePath, numberOfLines) => {
  return fileReader.readLastLines(filePath, numberOfLines);
};
// readLines('src/resources/myLittleFile.txt', 10);

const readNthLines = (filePath, lineNumber, numberOfLines) => {
  return fileReader.readNthLines(filePath, lineNumber, numberOfLines);
};
// readNthLines('src/resources/myLittleFile.txt', 10, 5).then(lines => {
//   console.log('Lines in engine.js...', JSON.stringify(lines, null, 2));
// });

const getNumberOfLines = _filePath => {
  return fileReader.getNumberOfLines(_filePath);
};
// getNumberOfLines('src/resources/myLittleFile.txt').then(lines => {
//   console.log('number of lines: ', lines);
// });

module.exports = {
  readLines: readLines,
  readNthLines: readNthLines,
  getNumberOfLines: getNumberOfLines
};
