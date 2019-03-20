const fs = require('fs');
const lastLines = require('read-last-lines');
const notifier = require('node-notifier');
const chokidar = require('chokidar');
const nthLine = require('nthline');
const seeMeFile = './src/testFileForWatch.log';
const { EventEmitter } = require('events');
const fileReaderEvents = new EventEmitter();
const watcher = require('chokidar');

// const writeStream = fs.createWriteStream('./src/resources/myLittleFile.txt');
// writeStream.once('open', fd => {
//   for (let i = 1; i < 1000001; i++) {
//     writeStream.write(`${i}\n`);
//   }
//   writeStream.end();
// });

const readLastLines = (filePath, numberOfLines) => {
  return lastLines.read(filePath, numberOfLines);
};

const readLinesLive = filePath => {
  //begin by reading and emitting the last 10 lines
  readLastLines(filePath, 10).then(lines => {
    fileReaderEvents.emit('liveLines', lines);
  });
  //find and save the index of the last newline characters
  let lastNewlineIndex = 0;
  fs.createReadStream(filePath)
    .setEncoding('utf8')
    .on('data', buffer => {
      lastNewlineIndex += buffer.lastIndexOf('\n');
    })
    .on('end', () => {
      // console.log('lastNewlineIndex: ', lastNewlineIndex);
    })
    .on('error', err => {
      throw new Error(err);
    });
  //start a watcher and read the new lines starting from the last newline index
  //whenever there is a change to the file.
  let watcher = chokidar.watch(filePath).on('change', (event, path, stats) => {
    // console.log('stats: ', stats);
    // var watchSize = 0;
    // if (stats && stats.size !== watchSize) {
    // watchSize = stats.size;
    let readStreamFromLastIndex = fs
      .createReadStream(filePath, {
        start: lastNewlineIndex
      })
      .setEncoding('utf8');
    readStreamFromLastIndex.on('data', buffer => {
      lastNewlineIndex += buffer.lastIndexOf('\n');
      let lines = '';
      if (buffer.split('\n')[0] === '') {
        lines = buffer.slice(1, buffer.lastIndexOf('\n'));
      } else {
        lines = buffer.slice(0, buffer.lastIndexOf('\n'));
      }
      // console.log(lines);
      fileReaderEvents.emit('liveLines', lines);
    });
    // }
  });
};
// readLinesLive('./src/resources/myLittleFile.txt');
// readLinesLive('../lologoggenerator/app/lologog/testLog.txt');

const getNumberOfLines = filePath => {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    let idx = -1;
    fs.createReadStream(filePath)
      .on('data', buffer => {
        lineCount--;
        do {
          idx = buffer.indexOf(10, idx + 1);
          lineCount++;
        } while (idx !== -1);
      })
      .on('end', () => {
        // console.log('idx: ', idx);
        // console.log('lineCount: ', lineCount);
        resolve(lineCount);
      })
      .on('error', err => {
        reject(err);
      });
  });
};
// getNumberOfLines('src/resources/myLittleFile.txt');

const readFile = (filePath, enc) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, enc, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const readNthLines = async (filePath, lineNumber, numberOfLines) => {
  let i;
  let lines = {};
  for (i = 0; i < numberOfLines; i++) {
    lines[lineNumber + i] = await nthLine(lineNumber + i - 1, filePath);
  }
  if (lines !== null) {
    return lines;
  } else {
    return 'Error occured.';
  }
};

// //Call on getNumberOfLines
// getNumberOfLines('myLittleFile.txt').then(lineCount => {
//   console.log(lineCount);
// });

//Call on readFile
// readFile('./src/myLittleFile.txt', null)
//   .then(data => {
//     console.log(data);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// //Call on readLastLinesa
// readLastLines('myLittleFile.txt', 5)
//   .then(lines => {
//     console.log(lines);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// //Call on readNthLines
// readNthLines('./src/resources/myLittleFile.txt', 1, 15).then(lines => {
//   console.log(JSON.stringify(lines, null, 2));
// });

//Call on startAlwaysTail
// startAlwaysTail('./src/resources/myLittleFile.txt');

module.exports = {
  readFile: readFile,
  readLastLines: readLastLines,
  getNumberOfLines: getNumberOfLines,
  readNthLines: readNthLines,
  readLinesLive: readLinesLive,
  fileReaderEvents: fileReaderEvents
};
