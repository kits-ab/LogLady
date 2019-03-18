const fs = require('fs');
const lastLines = require('read-last-lines');
const notifier = require('node-notifier');
const chokidar = require('chokidar');
const nthLine = require('nthline');
const seeMeFile = './src/testFileForWatch.log';

// chokidar.watch(seeMeFile).on('all', (event, path) => {
//   console.log(event, path);

//   if (event === 'change') {
//     notifier.notify({
//       title: 'Note',
//       message: 'change in file'
//     });
//   }
// });
// const nthLine = require('nthline');
// const alwaysTail = require('always-tail');

// const writeStream = fs.createWriteStream('./src/resources/myLittleFile.txt');
// writeStream.once('open', fd => {
//   for (let i = 1; i < 1000001; i++) {
//     writeStream.write(`${i}\n`);
//   }
//   writeStream.end();
// });

// const startAlwaysTail = filePath => {
//   let tail = new alwaysTail(filePath, '\n', { interval: 500 });
//   tail.on('line', line => {
//     console.log(line);
//   });
//   tail.on('error', err => {
//     console.log(err);
//   });
// };

const readLastLines = (filePath, numberOfLines) => {
  return lastLines.read(filePath, numberOfLines);
};

const readLinesLive = filePath => {
  // readLastLines(filePath, 10).then(lines => {
  //   console.log(lines);
  // });
  let chars = 0;
  let lastIndex = 0;
  let readStream = fs
    .createReadStream(filePath)
    .setEncoding('utf8')
    .on('data', buffer => {
      lastIndex += buffer.lastIndexOf('\n');
      // lastIndex += chars;
    })
    .on('end', () => {
      console.log('lastIndex: ', lastIndex);
    })
    .on('error', err => {
      throw new Error(err);
    });
  let watcher = chokidar.watch(filePath).on('change', (event, path) => {
    let readStreamFromLastIndex = fs
      .createReadStream(filePath, {
        start: lastIndex + 1
      })
      .setEncoding('utf8');
    readStreamFromLastIndex.on('data', buffer => {
      lastIndex += buffer.lastIndexOf('\n') + 1;
      console.log(buffer);
    });
  });
};
readLinesLive('./src/resources/myLittleFile.txt');

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
        console.log('idx: ', idx);
        console.log('lineCount: ', lineCount);
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
  readNthLines: readNthLines
};
