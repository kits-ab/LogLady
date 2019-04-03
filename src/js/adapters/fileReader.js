const fs = require('fs');
const lastLines = require('read-last-lines');
const nthLine = require('nthline');
const { EventEmitter } = require('events');
const fileReaderEvents = new EventEmitter();

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
    fileReaderEvents.emit('liveLines', lines.slice(0, lines.lastIndexOf('\n')));
  });
  //find and save the index of the last newline characters
  let lastNewlineIndex = 0;
  fs.createReadStream(filePath)
    .setEncoding('utf8')
    .on('data', buffer => {
      lastNewlineIndex += buffer.lastIndexOf('\n');
    })
    .on('end', () => {
      console.log('lastNewlineIndex: ', lastNewlineIndex);
    })
    .on('error', err => {
      throw new Error(err);
    });
  //start a watcher and read the new lines starting from the last newline index
  //whenever there is a change to the file.
  fs.watch(filePath, (event, filename) => {
    console.log('watcher started.');
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
      console.log('FR: ', lines);
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
    throw new Error('Lines are null.');
  }
};

const getFileSizeInBytes = async filePath => {
  try {
    const fileSizeInBytes = fs.statSync(filePath).size;
    return fileSizeInBytes;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  readFile: readFile,
  readLastLines: readLastLines,
  getNumberOfLines: getNumberOfLines,
  readNthLines: readNthLines,
  readLinesLive: readLinesLive,
  fileReaderEvents: fileReaderEvents,
  getFileSizeInBytes: getFileSizeInBytes
};
