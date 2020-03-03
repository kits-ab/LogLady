// Cache template
// const CACHE = {
//     sourcePath\1: {
//         lines: [{
//             line: 'line text',
//             startsAtByte: 123
//         },
//         {
//             line: 'line text',
//             startsAtByte: 234
//         }
//         ],
//      ...
//}

let cache = {};

const searchCache = (filepath, position, length) => {
  const result = cache[filepath]
    ? cache[filepath].lines
        .filter(line => {
          return line.startsAtByte > position;
        })
        .slice(0, length)
    : [];
  if (result.length < length) {
    return 'miss';
  } else {
    return parseResult(result);
  }
};

const updateCache = (filepath, lines, startByteOfLines) => {
  let cacheLines = _formatCacheLines(lines, startByteOfLines);

  if (cache[filepath]) {
    let currentCacheLines = cache[filepath].lines;

    const newLinesStartsBeforeCurrentLines =
      cacheLines[0].startsAtByte < currentCacheLines[0].startsAtByte;

    const newLinesIsEntirelyBeforeCurrent =
      cacheLines[cacheLines.length - 1].startsAtByte <
      currentCacheLines[0].startsAtByte;

    const newLinesEndEntirelyAfterCurrent =
      cacheLines[0].startsAtByte >
      currentCacheLines[currentCacheLines.length - 1].startsAtByte;

    const newLinesEndsAfterCurrent =
      cacheLines[cacheLines.length - 1].startsAtByte >
      currentCacheLines[currentCacheLines.length - 1].startsAtByte;

    if (newLinesStartsBeforeCurrentLines) {
      if (newLinesIsEntirelyBeforeCurrent) {
        addNewLinesBeforeCurrentLines(filepath, cacheLines, currentCacheLines);
      } else {
        addNewLinesPartiallyBeforeCurrent(
          filepath,
          cacheLines,
          currentCacheLines
        );
      }
    } else if (newLinesEndsAfterCurrent) {
      if (newLinesEndEntirelyAfterCurrent) {
        addNewLinesAfterCurrentLines(filepath, cacheLines, currentCacheLines);
      } else {
        addNewLinesEndingPartiallyAfterCurrent(
          filepath,
          cacheLines,
          currentCacheLines
        );
      }
    } else {
      addCurrentLinesBeforeAndAfterNewLines(
        filepath,
        cacheLines,
        currentCacheLines
      );
    }
  } else {
    cache[filepath] = { lines: cacheLines };
  }
};
const addNewLinesPartiallyBeforeCurrent = (
  filepath,
  cacheLines,
  currentCacheLines
) => {
  console.log('new is partially before current');
  const filteredLines = currentCacheLines.filter(line => {
    return line.startsAtByte > cacheLines[cacheLines.length - 1].startsAtByte;
  });
  cache[filepath] = { lines: [...cacheLines, ...filteredLines] };
};

const addNewLinesBeforeCurrentLines = (
  filepath,
  cacheLines,
  currentCacheLines
) => {
  cache[filepath] = {
    lines: [...cacheLines, ...cache[filepath].lines]
  };
};
const addNewLinesAfterCurrentLines = (
  filepath,
  cacheLines,
  currentCacheLines
) => {
  cache[filepath] = { lines: [...cache[filepath].lines, ...cacheLines] };
};

const addNewLinesEndingPartiallyAfterCurrent = (
  filepath,
  cacheLines,
  currentCacheLines
) => {
  console.log('new ends partially after current');
  const filteredLines = currentCacheLines.filter(line => {
    return line.startsAtByte < cacheLines[0].startsAtByte;
  });
  cache[filepath] = { lines: [...filteredLines, ...cacheLines] };
};

const addCurrentLinesBeforeAndAfterNewLines = (
  filepath,
  cacheLines,
  currentCacheLines
) => {
  console.log('new is contained within current');
  const filteredLinesStart = currentCacheLines.filter(line => {
    return line.startsAtByte > cacheLines[0].startsAtByte;
  });
  const filteredLinesEnd = currentCacheLines.filter(line => {
    return line.startsAtByte < cacheLines[cacheLines.length - 1].startsAtByte;
  });
  cache[filepath] = {
    lines: [...filteredLinesEnd, ...cacheLines, ...filteredLinesStart]
  };
};

const flushCache = data => {
  cache = {};
};
const _checkCacheSize = cache => {
  /*check if cache has reached the limit of 100mb*/
};

const _formatCacheLines = (lines, startByteOfLines) => {
  return lines.map((line, index) => {
    return { line: line, startsAtByte: startByteOfLines[index] };
  });
};

const parseResult = result => {
  const startsAtByte = result.map(byte => {
    return byte.startsAtByte;
  });
  const lines = result.map(line => {
    return line.line;
  });
  return { lines, startsAtByte };
};

module.exports = {
  updateCache,
  flushCache,
  searchCache
};
