const {
  formatCacheLines,
  formatCachedPartsInfo,
  parseResult
} = require('../helpers/cacheHelper');

// cache object format example
// cache = {
//        'filepath/example.log': {
//                                  lines: [{line: 'hi', startsAtByte: 0},
//                                          {line: 'hi', startsAtByte: 2}],
//                                  cachedPartsInfo: [ {startsAt: 0, endsAt: 2, startByteOfLines: [0, 2]}, ],
//                                 },
//        }
let cache = {};

const searchCache = (filepath, position, amountOfLines, fileSize = 0) => {
  if (cache[filepath]) {
    const chunkInfo = cache[filepath].cachedPartsInfo;

    for (let chunk of chunkInfo) {
      const positionIsWithinLimit =
        position >= chunk.startsAt && position <= chunk.endsAt;
      if (positionIsWithinLimit) {
        // used to control that enough lines exist in the chunk.
        const nrOfLinesFromPos = chunk.startByteOfLines.filter(nr => {
          return nr >= position;
        }).length;

        const linesToReturn = cache[filepath].lines
          .filter(line => {
            return line.startsAtByte >= position;
          })
          .slice(0, amountOfLines);

        const toReturn = parseResult(linesToReturn, fileSize);
        const hasRequstedNrOfLines = nrOfLinesFromPos >= amountOfLines;

        if (hasRequstedNrOfLines) {
          return toReturn;
        } else if (toReturn.isEndOfFile) {
          // Make sure that the correct amount of lines are returned if the position is close to the end of the file
          const fromIndex = cache[filepath].lines.length - amountOfLines;
          const endOfCache = cache[filepath].lines.slice(fromIndex);
          return parseResult(endOfCache, fileSize);
        }
      }
    }
    // Cached chunk does not have enough lines or data from the position does not exist in cache
    return 'miss';
  } else {
    // File does not exist in cache
    return 'miss';
  }
};

const updateCache = (filepath, lines, startByteOfLines) => {
  let cacheLines = formatCacheLines(lines, startByteOfLines);
  let cachedPartsInfo = formatCachedPartsInfo(startByteOfLines);

  if (cache[filepath]) {
    let currentCacheLines = cache[filepath].lines;
    const newLinesStartsBeforeCurrentLines =
      cacheLines[0].startsAtByte < currentCacheLines[0].startsAtByte;

    const newLinesAreEntirelyBeforeCurrentLines =
      cacheLines[cacheLines.length - 1].startsAtByte <
      currentCacheLines[0].startsAtByte;

    const newLinesEndEntirelyAfterCurrentLines =
      cacheLines[0].startsAtByte >
      currentCacheLines[currentCacheLines.length - 1].startsAtByte;

    const newLinesEndAfterCurrentLines =
      cacheLines[cacheLines.length - 1].startsAtByte >
      currentCacheLines[currentCacheLines.length - 1].startsAtByte;

    if (newLinesStartsBeforeCurrentLines) {
      if (newLinesAreEntirelyBeforeCurrentLines) {
        addNewLinesBeforeCurrentLines(filepath, cacheLines, cachedPartsInfo);
      } else {
        addNewLinesPartiallyBeforeCurrent(
          filepath,
          cacheLines,
          currentCacheLines,
          cachedPartsInfo
        );
      }
    } else if (newLinesEndAfterCurrentLines) {
      if (newLinesEndEntirelyAfterCurrentLines) {
        addNewLinesAfterCurrentLines(filepath, cacheLines, cachedPartsInfo);
      } else {
        addNewLinesEndingPartiallyAfterCurrent(
          filepath,
          cacheLines,
          currentCacheLines,
          cachedPartsInfo
        );
      }
    } else {
      addCurrentLinesBeforeAndAfterNewLines(
        filepath,
        cacheLines,
        currentCacheLines,
        cachedPartsInfo
      );
    }
  } else {
    cache[filepath] = { lines: cacheLines, cachedPartsInfo };
  }
};

const addNewLinesPartiallyBeforeCurrent = (
  filepath,
  cacheLines,
  currentCacheLines,
  cachedPartsInfo
) => {
  console.log('new is partially before current');
  const filteredLines = currentCacheLines.filter(line => {
    return line.startsAtByte > cacheLines[cacheLines.length - 1].startsAtByte;
  });

  cache[filepath] = {
    lines: [...cacheLines, ...filteredLines],
    cachedPartsInfo: [...cachedPartsInfo, ...cache[filepath].cachedPartsInfo]
  };
};

const addNewLinesBeforeCurrentLines = (
  filepath,
  cacheLines,
  cachedPartsInfo
) => {
  console.log('new is before current');
  cache[filepath] = {
    lines: [...cacheLines, ...cache[filepath].lines],
    cachedPartsInfo: [...cachedPartsInfo, ...cache[filepath].cachedPartsInfo]
  };
};

const addNewLinesAfterCurrentLines = (
  filepath,
  cacheLines,
  cachedPartsInfo
) => {
  console.log('new is after current');
  cache[filepath] = {
    lines: [...cache[filepath].lines, ...cacheLines],
    cachedPartsInfo: [...cache[filepath].cachedPartsInfo, ...cachedPartsInfo]
  };
};

const addNewLinesEndingPartiallyAfterCurrent = (
  filepath,
  cacheLines,
  currentCacheLines,
  cachedPartsInfo
) => {
  console.log('new ends partially after current');
  const filteredLines = currentCacheLines.filter(line => {
    return line.startsAtByte < cacheLines[0].startsAtByte;
  });
  cache[filepath] = {
    lines: [...filteredLines, ...cacheLines],
    cachedPartsInfo: [...cache[filepath].cachedPartsInfo, ...cachedPartsInfo]
  };
};

const addCurrentLinesBeforeAndAfterNewLines = (
  filepath,
  cacheLines,
  currentCacheLines,
  cachedPartsInfo
) => {
  console.log('new is contained within current');

  const filteredLinesStart = currentCacheLines.filter(line => {
    return line.startsAtByte < cacheLines[0].startsAtByte;
  });
  const filteredLinesEnd = currentCacheLines.filter(line => {
    return line.startsAtByte > cacheLines[cacheLines.length - 1].startsAtByte;
  });

  cache[filepath] = {
    lines: [...filteredLinesStart, ...cacheLines, ...filteredLinesEnd],
    cachedPartsInfo: [...cachedPartsInfo, ...cache[filepath].cachedPartsInfo]
  };
};

const flushCache = () => {
  cache = {};
};

const flushCacheForOneFile = filepath => {
  delete cache[filepath];
};

/*check if cache has reached the limit of 100mb (a hundred millon bytes)*/
const cacheInit = cache;
const checkIfCacheIsWithinSizeLimit = (cache = cacheInit) => {
  const cacheSize = Buffer.byteLength(JSON.stringify(cache), 'utf8');
  const sizeLimit = 100000000;
  return cacheSize < sizeLimit ? true : false;
};

module.exports = {
  updateCache,
  flushCache,
  flushCacheForOneFile,
  searchCache,
  checkIfCacheIsWithinSizeLimit
};
