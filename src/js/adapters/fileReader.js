const fs = require('fs');
const app = require('electron').app;
const path = require('path');
const createBackwardsStream = require('fs-backwards-stream');

let watchers = [];

const reduxStateFile = () => {
  return path.join(app.getPath('userData'), 'reduxState.json');
};

const recentFiles = () => {
  return path.join(app.getPath('userData'), 'recentFiles.json');
};

const isNewLineByte = b => {
  return b === 10;
};

const isReturnByte = b => {
  return b === 13;
};

//start a watcher and read the new lines starting from the last newline index
//whenever there is a change to the file.
const startWatcher = (filePath, startIndex, onChange, onError) => {
  let currentIndex = startIndex;
  let unusedChars = '';
  if (watchers[filePath] !== undefined) {
    watchers[filePath].close();
  }
  let watcher = fs.watch(filePath, (_event, _filename) => {
    fs.createReadStream(filePath, {
      start: currentIndex
    })
      .setEncoding('utf8')
      .on('data', chunk => {
        currentIndex += chunk.length;
        const [lines, trailingChars] = formatChunk(chunk, unusedChars);
        unusedChars = trailingChars;
        if (lines.length > 0) {
          onChange(lines);
        }
      })
      .on('error', error => {
        onError(error);
      });
  });

  watchers[filePath] = watcher;
};

const formatChunk = (chunk, prevChunkTrailingChars, reverse = false) => {
  const lines = chunk.split(/\r?\n/);
  const start = reverse ? lines.length - 1 : 0;
  const end = reverse ? 0 : lines.length - 1;
  lines[start] += prevChunkTrailingChars;
  const trailingChars = lines[end];
  reverse ? lines.shift() : lines.pop();

  return [lines, trailingChars];
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
    return `successfully closed watcher on file ${filePath}`; //if we want to send a confirmation to the frontend.
  } catch (err) {
    return err;
  }
};

const followFile = (filePath, startIndex, onChange, onError) => {
  startWatcher(filePath, startIndex, onChange, onError);
};

const readNLastLines = (filePath, numberOfLines, endIndex) => {
  return new Promise((resolve, reject) => {
    let unusedChars = '';
    let result = [];
    let backwardsStream = createBackwardsStream(filePath, {
      start: endIndex - 1
    });
    backwardsStream
      .on('data', buffer => {
        const chunk = buffer.toString('utf-8');
        const [lines, trailingChars] = formatChunk(chunk, unusedChars, true);
        unusedChars = trailingChars;
        if (lines.length > 0) {
          if (result.length + lines.length >= numberOfLines) {
            const offset = lines.length - (numberOfLines - result.length);
            result = [...lines.slice(Math.max(offset, 0)), ...result];
            backwardsStream.emit('end');
            return;
          }
          result = [...lines, ...result];
        }
      })
      .on('end', () => {
        resolve(result);
      })
      .on('error', err => {
        reject(err);
      });
  });
};

const getLastNewLineIndex = (filePath, endIndex) => {
  let index = 0;
  let result = endIndex;

  return new Promise((resolve, reject) => {
    let backwardsStream = createBackwardsStream(filePath, { start: endIndex });
    backwardsStream
      .on('data', chunk => {
        for (let i = chunk.length - 1; i > 0; i--) {
          if (isNewLineByte(chunk[i])) {
            result = endIndex - (chunk.length - i + index);
            backwardsStream.emit('end');
            return;
          }
        }

        index += chunk.length;
      })
      .on('end', () => {
        resolve(result);
      })
      .on('error', error => {
        reject(error);
      });
  });
};

//This will count the lines until the end index, if the file is big this will take a lot of time!
const getLineCount = (filePath, endIndex) => {
  return new Promise((resolve, reject) => {
    let lineCount = 0;

    fs.createReadStream(filePath, { end: endIndex })
      .on('data', chunk => {
        for (let i = 0; i < chunk.length; i++) {
          if (isNewLineByte(chunk[i])) lineCount++;
          else if (
            i + 1 < chunk.length &&
            isReturnByte(chunk[i]) &&
            isNewLineByte(chunk[i + 1]) === 10
          ) {
            i++; //skip (i + 1) so it doesn't count twice
            lineCount++;
          }
        }
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

const getFileSizeInBytes = filePath => {
  return fs.statSync(filePath).size;
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
  getLineCount,
  followFile,
  getFileSizeInBytes,
  getLastNewLineIndex,
  stopWatcher,
  stopAllWatchers,
  saveStateToDisk,
  loadStateFromDisk,
  saveRecentFilesToDisk,
  loadRecentFilesFromDisk
};
