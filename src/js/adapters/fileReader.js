const {
  createReadStream,
  statSync,
  readFile,
  writeFile,
  open,
  close,
  read,
  stat
} = require('fs');
const app = require('electron').app;
const path = require('path');
const createBackwardsStream = require('fs-backwards-stream');
const chokidar = require('chokidar');

let watchers = [];

const reduxStateFile = () => {
  return path.join(app.getPath('userData'), 'reduxState.json');
};

const recentFiles = () => {
  return path.join(app.getPath('userData'), 'recentFiles.json');
};

const isLF = b => {
  return b === 10;
};

const readTail = (filePath, startIndex, onLines, onError) => {
  return new Promise((resolve, reject) => {
    let unusedChars = '';
    let currentIndex = startIndex;

    createReadStream(filePath, {
      start: currentIndex
    })
      .setEncoding('utf8')
      .on('data', chunk => {
        currentIndex += chunk.length;
        const [lines, trailingChars] = parseLines(chunk, unusedChars);
        unusedChars = trailingChars;
        const filtered = lines.filter(x => {
          return x !== '';
        });
        if (filtered.length > 0) {
          onLines(filtered, chunk.length);
        }
      })
      .on('end', () => {
        resolve(currentIndex);
      })
      .on('error', error => {
        onError(error);
        resolve(error);
      });
  });
};

//start a watcher and read the new lines starting from the last newline index
//whenever there is a change to the file.
const followFile = (filePath, startIndex, onLines, onError) => {
  let currentIndex = startIndex;

  if (watchers[filePath] !== undefined) {
    watchers[filePath].close();
  }

  /* UsePolling gives better results while the file is appended continously, but might give a hit to performance */
  let watcher = chokidar.watch(filePath, {
    persistent: true,
    usePolling: true
  });

  watcher.on('change', async () => {
    currentIndex = await readTail(filePath, currentIndex, onLines, onError);
  });

  watchers[filePath] = watcher;
};

/**parseLinesBackwards
 * @param {string} chunk
 * @param {string} trailingChars are any unused characters from the previous chunk
 * @returns {[string[], string]}
 */
const parseLinesBackwards = (chunk, trailingChars) => {
  // Move over the previous chunk character to check for CRLF
  if (trailingChars.length > 0) {
    chunk = chunk + trailingChars[0];
    trailingChars = trailingChars.slice(1);
  }

  const lines = chunk.split(/\r?\n/);
  lines[lines.length - 1] += trailingChars;
  const unusedChars = lines[0];
  lines.shift();

  return [lines, unusedChars];
};

/**
 * parseLines parses a string into an array of lines, and also returns any unused characters
 * @param {string} chunk
 * @param {string} trailingChars are any unused characters from the previous chunk
 * @returns {[string[], string]}
 */
const parseLines = (chunk, trailingChars) => {
  // Move over the previous chunk character to check for CRLF
  if (trailingChars.length > 0) {
    chunk = trailingChars[trailingChars.length - 1] + chunk;
    trailingChars = trailingChars.slice(0, trailingChars.length - 1);
  }

  const lines = chunk.split(/\r?\n/);
  lines[0] = trailingChars + lines[0];
  const unusedChars = lines[lines.length - 1];
  lines.pop();

  return [lines, unusedChars];
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
        const [lines, trailingChars] = parseLinesBackwards(chunk, unusedChars);
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
        if (result.length < numberOfLines && unusedChars) {
          result.unshift(unusedChars);
        }

        resolve([
          result,
          calculateMetaDataBackwards(result, getFileSizeInBytes(filePath))
        ]);
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
          if (isLF(chunk[i])) {
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

const countLinesInBuffer = buffer => {
  let lineCount = 0;

  for (let i = -1; i < buffer.length; i++) {
    if (isLF(buffer[i])) lineCount++;
  }

  return lineCount;
};

//This will count the lines until the end index, if the file is big this will take a lot of time!
const getLineCount = (filePath, endIndex) => {
  return new Promise((resolve, reject) => {
    let lineCount = 0;

    createReadStream(filePath, { end: endIndex })
      .on('data', chunk => {
        lineCount += countLinesInBuffer(chunk);
      })
      .on('end', () => {
        resolve(lineCount);
      })
      .on('error', err => {
        reject(err);
      });
  });
};

const readFileAsync = filePath => {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getFileSizeInBytes = filePath => {
  return statSync(filePath).size;
};

const saveStateToDisk = _reduxStateValue => {
  writeFile(reduxStateFile(), _reduxStateValue, err => {
    if (err) {
      throw err;
    }
    console.log('LogLady: state has been succefully saved to disk.');
    return 'success';
  });
};

const loadStateFromDisk = () => {
  return readFileAsync(reduxStateFile());
};

const saveRecentFilesToDisk = _recentFiles => {
  writeFile(recentFiles(), _recentFiles, err => {
    if (err) {
      throw err;
    }
    console.log('LogLady: recent files have been succefully saved to disk.');
    return 'success';
  });
};

const loadRecentFilesFromDisk = () => {
  return readFileAsync(recentFiles());
};

const readDataFromByte = (filePath, start, numberOfBytes) => {
  return new Promise((resolve, reject) => {
    stat(filePath, function(error, stats) {
      if (error) {
        reject(error);
      }

      open(filePath, 'r', function(error, fd) {
        if (error) {
          reject(error);
        }

        var buffer = Buffer.alloc(numberOfBytes);
        read(fd, buffer, 0, buffer.length, start, function(
          error,
          bytesRead,
          buffer
        ) {
          // Close file so we dont have too many open at once
          close(fd, err => {
            reject(error);
          });

          if (error) {
            reject(error);
          }

          var data = buffer.toString('utf8');
          resolve(parseSelectedData(data, start, numberOfBytes));
        });
      });
    });
  });
};

const parseSelectedData = (data, start, numberOfBytes) => {
  const lines = data.split(/\r?\n/);
  const lineSizeTop = Buffer.byteLength(lines[0], 'utf8');
  const lineSizeBottom = Buffer.byteLength(lines[lines.length - 1], 'utf8');

  let linesStartAt = start;
  let linesEndAt = start + numberOfBytes;

  // We aren't reading from the beginning of the file
  if (start !== 0) {
    linesStartAt = start + lineSizeTop;
    lines.shift();
  }

  // If lines does not end in a newline, last line is incomplete
  // and should be removed
  if (!isLF(data.charAt(data.length - 1))) {
    linesEndAt = start + numberOfBytes - lineSizeBottom;
    lines.pop();
  }

  const metaData = calculateMetaData(lines, linesStartAt);

  return {
    metaData,
    lines,
    linesStartAt,
    linesEndAt
  };
};

const calculateMetaData = (lines, linesStartAt) => {
  let metaData = [];
  let currentLineStartByte = linesStartAt;
  for (const line of lines) {
    metaData.push(currentLineStartByte);
    currentLineStartByte =
      currentLineStartByte + Buffer.byteLength(line, 'utf8');
  }
  return metaData;
};

const calculateMetaDataBackwards = (lines, filesize) => {
  let reversedLines = [...lines].reverse();
  let metaData = [];
  let currentLineStartByte = filesize - Buffer.byteLength(reversedLines[0]);
  for (const line of reversedLines) {
    metaData.unshift(currentLineStartByte);
    currentLineStartByte =
      currentLineStartByte - Buffer.byteLength(line, 'utf8');
  }
  return metaData;
};

module.exports = {
  readFile,
  readNLastLines,
  getLineCount,
  followFile,
  parseLinesBackwards,
  countLinesInBuffer,
  parseLines,
  readFileAsync,
  getFileSizeInBytes,
  getLastNewLineIndex,
  stopWatcher,
  stopAllWatchers,
  saveStateToDisk,
  loadStateFromDisk,
  saveRecentFilesToDisk,
  loadRecentFilesFromDisk,
  readDataFromByte
};
