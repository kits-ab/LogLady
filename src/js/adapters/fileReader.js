const { createReadStream, statSync, open, close, read, stat } = require('fs');
const createBackwardsStream = require('fs-backwards-stream');
const chokidar = require('chokidar');

let watchers = {};

const isLF = b => {
  return b === 10;
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

const stopWatcher = filePath => {
  try {
    watchers[filePath].close();
    delete watchers[filePath];
    return `successfully closed watcher on file ${filePath}`; //if we want to send a confirmation to the frontend.
  } catch (err) {
    return err;
  }
};

const stopAllWatchers = () => {
  for (var key in watchers) {
    watchers[key].close();
  }
  watchers = {};
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

//This will count the lines until the end index, if the file is big this will take a lot of time!
const getLineCountWithLimitOf5000 = (filePath, endIndex) => {
  return new Promise((resolve, reject) => {
    let lineCount = 0;

    createReadStream(filePath, { end: endIndex })
      .on('data', chunk => {
        lineCount += countLinesInBuffer(chunk);
        if (lineCount > 5000) resolve(lineCount);
      })
      .on('end', () => {
        resolve(lineCount);
      })
      .on('error', err => {
        reject(err);
      });
  });
};

const getTotalLineCount = (filePath, endIndex) => {
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

const countLinesInBuffer = buffer => {
  let lineCount = 0;
  for (let i = -1; i < buffer.length; i++) {
    if (isLF(buffer[i])) lineCount++;
  }
  return lineCount;
};

const getFileSizeInBytes = filePath => {
  return statSync(filePath).size;
};

const readDataFromByte = (filePath, startReadFromByte, numberOfBytes) => {
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
        read(fd, buffer, 0, buffer.length, startReadFromByte, function(
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
          resolve(
            parseByteDataIntoStringArrayWithStartByteOfLines(
              data,
              startReadFromByte,
              numberOfBytes
            )
          );
        });
      });
    });
  });
};

const parseByteDataIntoStringArrayWithStartByteOfLines = (
  data,
  start,
  numberOfBytes
) => {
  const linesData = parseByteDataIntoStringArray(data, start, numberOfBytes);
  const lines = linesData.lines;
  const linesStartAt = Math.round(linesData.linesStartAt);
  const linesEndAt = linesData.linesEndAt;
  const startByteOfLines = extractStartByteOfLinesFromByteData(
    lines,
    linesStartAt
  );

  return {
    startByteOfLines,
    lines,
    linesStartAt,
    linesEndAt
  };
};

const parseByteDataIntoStringArray = (data, start, numberOfBytes) => {
  const BYTE_FOR_MISSING_NEWLINE = 1;

  const lines = data.split(/\r?\n/);
  const lineSizeTop =
    Buffer.byteLength(lines[0], 'utf8') + BYTE_FOR_MISSING_NEWLINE;
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

  return { lines, linesStartAt, linesEndAt };
};

const extractStartByteOfLinesFromByteData = (lines, linesStartAt) => {
  const BYTE_FOR_MISSING_NEWLINE = 1;
  let startByteOfLines = [];
  let currentLineStartByte = linesStartAt;
  lines.forEach(line => {
    startByteOfLines.push(currentLineStartByte);
    currentLineStartByte +=
      Buffer.byteLength(line, 'utf8') + BYTE_FOR_MISSING_NEWLINE;
  });
  return startByteOfLines;
};

module.exports = {
  getTotalLineCount,
  getLineCountWithLimitOf5000,
  followFile,
  countLinesInBuffer,
  parseLines,
  getFileSizeInBytes,
  getLastNewLineIndex,
  stopWatcher,
  stopAllWatchers,
  readDataFromByte,
  extractStartByteOfLinesFromByteData,
  parseByteDataIntoStringArray
};
