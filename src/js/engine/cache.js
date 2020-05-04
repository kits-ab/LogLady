let cache = {};

const searchCache = (filepath, position, amountOfLines) => {
  if (cache[filepath]) {
    const info = cache[filepath].cachedPartsInfo;

    for (let part of info) {
      const positionIsWithinLimit =
        position >= part.startsAt && position <= part.endsAt;

      if (positionIsWithinLimit) {
        const result = cache[filepath].lines
          .filter(line => {
            return line.startsAtByte >= position;
          })
          .slice(0, amountOfLines);
        return _parseResult(result);
      }
    }

    return 'miss';
  } else {
    return 'miss';
  }
};

const updateCache = (filepath, lines, startByteOfLines) => {
  let cacheLines = _formatCacheLines(lines, startByteOfLines);
  let cachedPartsInfo = _formatCachedPartsInfo(startByteOfLines);

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

const _formatCacheLines = (lines, startByteOfLines) => {
  return lines.map((line, index) => {
    return { line: line, startsAtByte: startByteOfLines[index] };
  });
};

const _formatCachedPartsInfo = startByteOfLines => {
  const startsAt = startByteOfLines[0];
  const endsAt = startByteOfLines[startByteOfLines.length - 1];
  return [{ startsAt, endsAt, startByteOfLines }];
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
