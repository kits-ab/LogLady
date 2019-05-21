const fs = require('fs');
const lastLines = require('read-last-lines');
const nthLine = require('nthline');
const { EventEmitter } = require('events');
const app = require('electron').app;
const path = require('path');

let watchers = [];

const fileReaderEvents = new EventEmitter();
fileReaderEvents.removeAllListeners('liveLines');

const reduxStateFile = () => {
  return path.join(app.getPath('userData'), 'reduxState.json');
};

const recentFiles = () => {
  return path.join(app.getPath('userData'), 'recentFiles.json');
};

const readNLastLines = (filePath, numberOfLines) => {
  return lastLines.read(filePath, numberOfLines).then(lines => {
    return lines.slice(0, lines.lastIndexOf('\n'));
  });
};

//find and save the index of the last newline characters
const getLastNewlineIndex = filePath => {
  let lastNewlineIndex = 0;
  let readStream = fs.createReadStream(filePath).setEncoding('utf8');

  readStream.on('data', buffer => {
    lastNewlineIndex += buffer.lastIndexOf('\n');
  });

  return new Promise((resolve, reject) => {
    readStream.on('end', () => {
      resolve(lastNewlineIndex);
    });

    readStream.on('error', err => {
      reject(err);
    });
  });
};

const formatLinesFromBuffer = _buffer => {
  if (_buffer.split('\n')[0] === '') {
    return _buffer.slice(1, _buffer.lastIndexOf('\n'));
  } else {
    return _buffer.slice(0, _buffer.lastIndexOf('\n'));
  }
};

//start a watcher and read the new lines starting from the last newline index
//whenever there is a change to the file.
const startWatcher = (filePath, lastNewlineIndex, onChange) => {
  if (watchers[filePath] !== undefined) {
    watchers[filePath].close();
  }
  let watcher = fs.watch(filePath, (_event, _filename) => {
    let readStreamFromLastIndex = fs
      .createReadStream(filePath, {
        start: lastNewlineIndex
      })
      .setEncoding('utf8');
    readStreamFromLastIndex.on('data', buffer => {
      lastNewlineIndex += buffer.lastIndexOf('\n');
      const lines = formatLinesFromBuffer(buffer);
      onChange(lines);
    });
  });
  watchers[filePath] = watcher;
};

const stopAllWatchers = () => {
  for (var key in watchers) {
    watchers[key].close();
  }
  watchers = {};
};

const stopWatcher = filePath => {
  try {
    watchers[filePath].close();
    delete watchers[filePath];
    fileReaderEvents.removeAllListeners('liveLines');
    return `successfully closed watcher on file ${filePath}`; //if we want to send a confirmation to the frontend.
  } catch (err) {
    return err;
  }
};

const followFile = async (filePath, onChange) => {
  const indexOfLastNewLine = await getLastNewlineIndex(filePath);
  startWatcher(filePath, indexOfLastNewLine, onChange);
};

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
        resolve(lineCount);
      })
      .on('error', err => {
        reject(err);
      });
  });
};

const readFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
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
    const fileSizeInBytes = await fs.statSync(filePath).size;
    return fileSizeInBytes;
  } catch (err) {
    throw err;
  }
};

const saveStateToDisk = _reduxStateValue => {
  fs.writeFile(reduxStateFile(), _reduxStateValue, err => {
    if (err) {
      throw err;
    }
    console.log('LogLady: state has been succefully saved to disk.');
    return 'success';
  });
};

const loadStateFromDisk = () => {
  return readFile(reduxStateFile());
};

const saveRecentFilesToDisk = _recentFiles => {
  fs.writeFile(recentFiles(), _recentFiles, err => {
    if (err) {
      throw err;
    }
    console.log('LogLady: recent files have been succefully saved to disk.');
    return 'success';
  });
};

const loadRecentFilesFromDisk = () => {
  return readFile(recentFiles());
};

module.exports = {
  readFile,
  readNLastLines,
  getNumberOfLines,
  readNthLines,
  followFile,
  fileReaderEvents,
  getFileSizeInBytes,
  stopWatcher,
  stopAllWatchers,
  saveStateToDisk,
  loadStateFromDisk,
  formatLinesFromBuffer,
  saveRecentFilesToDisk,
  loadRecentFilesFromDisk
};
