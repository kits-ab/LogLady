const fs = require('fs');
const lastLines = require('read-last-lines');
const app = require('electron').app;
const path = require('path');

let watchers = [];

const reduxStateFile = () => {
  return path.join(app.getPath('userData'), 'reduxState.json');
};

const recentFiles = () => {
  return path.join(app.getPath('userData'), 'recentFiles.json');
};

const readNLastLines = (filePath, numberOfLines) => {
  return lastLines.read(filePath, numberOfLines).then(buffer => {
    const lines = buffer.split(/\r?\n/);
    return lines.filter(x => {
      return x !== '';
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

const formatChunk = (chunk, prevChunkTrailingChars) => {
  const lines = chunk.split(/\r?\n/);
  lines[0] += prevChunkTrailingChars;
  const trailingChars = lines[lines.length - 1];
  lines.pop();

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

const getLinesInfo = (filePath, historyLength = 0) => {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    let endIndex = 0;
    let history = [];
    let unusedChars = '';

    fs.createReadStream(filePath)
      .setEncoding('utf8')
      .on('data', chunk => {
        const [lines, trailingChars] = formatChunk(chunk, unusedChars);
        unusedChars = trailingChars;

        if (historyLength > 0) {
          history.push(...lines);
          history = history.slice(Math.max(history.length - historyLength, 0));
        }

        lineCount += lines.length;
        endIndex += chunk.length;
      })
      .on('end', () => {
        endIndex = endIndex - unusedChars.length;
        resolve([lineCount, endIndex, history]);
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
  getLinesInfo,
  followFile,
  getFileSizeInBytes,
  stopWatcher,
  stopAllWatchers,
  saveStateToDisk,
  loadStateFromDisk,
  formatLinesFromBuffer,
  saveRecentFilesToDisk,
  loadRecentFilesFromDisk
};
