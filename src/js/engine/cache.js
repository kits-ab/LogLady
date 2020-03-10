// Cache template
// const cache = {
//     sourcePath\1: {
//         cachedPartsInfo: [{startsAt: 0, endsAt: 10}, {startsAt: 100, endsAt: 150}]
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

const searchCache = (filepath, position, amountOfLines, fileSize) => {
  // Kolla om raden med startbyten finns
  // Alla rader som är större än startsAtByte kommer ju alltid att finnas..
  if (cache[filepath]) {
    const firstIndexOfCacheStartByte = cache[filepath].lines[0].startsAtByte;

    console.log({
      filepath: cache[filepath].lines.startsAtByte,
      firstIndexOfCacheStartByte
    });
    const lastIndexOfCacheStartByte =
      cache[filepath].lines[cache[filepath].lines.length - 1].startsAtByte;
    console.log({ lastIndexOfCacheStartByte });
    if (
      position < firstIndexOfCacheStartByte ||
      position > lastIndexOfCacheStartByte
    ) {
      return 'miss';
    }
  }
  const result = cache[filepath]
    ? cache[filepath].lines
        .filter(line => {
          return line.startsAtByte >= position;
        })
        .slice(0, amountOfLines)
    : [];
  console.log({ searchCache, amountOfLines, resultLength: result.length });
  return _parseResult(result);
};

const updateCache = (filepath, lines, startByteOfLines) => {
  let cacheLines = _formatCacheLines(lines, startByteOfLines);

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
        addNewLinesBeforeCurrentLines(filepath, cacheLines, currentCacheLines);
      } else {
        addNewLinesPartiallyBeforeCurrent(
          filepath,
          cacheLines,
          currentCacheLines
        );
      }
    } else if (newLinesEndAfterCurrentLines) {
      if (newLinesEndEntirelyAfterCurrentLines) {
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

const addNewLinesBeforeCurrentLines = (filepath, cacheLines) => {
  cache[filepath] = {
    lines: [...cacheLines, ...cache[filepath].lines]
  };
};

const addNewLinesAfterCurrentLines = (filepath, cacheLines) => {
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
    return line.startsAtByte < cacheLines[0].startsAtByte;
  });
  const filteredLinesEnd = currentCacheLines.filter(line => {
    return line.startsAtByte > cacheLines[cacheLines.length - 1].startsAtByte;
  });
  cache[filepath] = {
    lines: [...filteredLinesStart, ...cacheLines, ...filteredLinesEnd]
  };
};

const flushCache = () => {
  cache = {};
};

const flushCacheForOneFile = filepath => {
  delete cache[filepath];
};

const cacheInit = cache;
const checkIfCacheIsWithinSizeLimit = (cache = cacheInit) => {
  /*check if cache has reached the limit of 100mb (a hundred millon bytes)*/
  const cacheSize = Buffer.byteLength(JSON.stringify(cache), 'utf8');
  const sizeInMB = (cacheSize * Math.pow(10, -6)).toFixed(2);
  console.log('cacheSize ' + sizeInMB + 'mb');
  const sizeLimit = 100000000;
  console.log({ withinLimit: cacheSize < sizeLimit });
  return cacheSize < sizeLimit ? true : false;
};

const _formatCacheLines = (lines, startByteOfLines) => {
  return lines.map((line, index) => {
    return { line: line, startsAtByte: startByteOfLines[index] };
  });
};

const _parseResult = result => {
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
  flushCacheForOneFile,
  searchCache,
  checkIfCacheIsWithinSizeLimit
};
