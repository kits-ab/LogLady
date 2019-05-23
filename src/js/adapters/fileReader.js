const fs = require('fs');
const app = require('electron').app;
const path = require('path');
const createBackwardsReadStream = require('fs-backwards-stream');

let watchers = [];

const reduxStateFile = () => {
  return path.join(app.getPath('userData'), 'reduxState.json');
};

const recentFiles = () => {
  return path.join(app.getPath('userData'), 'recentFiles.json');
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
const startWatcher = (filePath, fromIndex, onChange, onError) => {
  let currentIndex = fromIndex;
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

const followFile = async (filePath, fromIndex, onChange, onError) => {
  startWatcher(filePath, fromIndex, onChange, onError);
};

const readNLastLines = (filePath, numberOfLines, endIndex) => {
  return new Promise((resolve, reject) => {
    let unusedChars = '';
    let result = [];
    const readStream = createBackwardsReadStream(filePath, { start: endIndex });
    readStream
      .on('data', buffer => {
        const chunk = buffer.toString('utf-8');
        const [lines, trailingChars] = formatChunk(chunk, unusedChars);
        unusedChars = trailingChars;
        if (lines.length > 0) {
          result.push(...lines);
        }

        if (result.length >= numberOfLines) {
          resolve(result.slice(Math.max(0, result.length - numberOfLines)));
          readStream.destroy();
          return;
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

  return new Promise((resolve, reject) => {
    let readStream = createBackwardsReadStream(filePath, { start: endIndex });
    readStream
      .on('data', chunk => {
        console.log('CHUNK: ', chunk.toString('utf-8'));
        for (let i = chunk.length - 1; i > 0; i--) {
          if (chunk[i] === 10) {
            console.log('I FOUND!', endIndex - (chunk.length - i + index));
            resolve(endIndex - (chunk.length - i + index));
            readStream.pause();
            readStream = null;
            return;
          }
        }

        index += chunk.length;
      })
      .on('end', () => {
        resolve(0);
      })
      .on('error', error => {
        reject(error);
      });
  });
};

const getLineCount = (filePath, endIndex) => {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    let endIndex = 0;

    fs.createReadStream(filePath, { end: endIndex })
      .setEncoding('utf8')
      .on('data', chunk => {
        for (let i = 0; i < chunk.length; i++) {
          if (chunk[i] === 10) lineCount++;
          else if (
            i + 1 < chunk.length &&
            chunk[i] === 13 &&
            chunk[i + 1] === 10
          ) {
            i++;
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
  formatLinesFromBuffer,
  saveRecentFilesToDisk,
  loadRecentFilesFromDisk
};
