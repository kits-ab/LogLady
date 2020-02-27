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

const CACHE = {};
const createCache = data => {};
const searchCache = data => {
  /*cache hit or miss*/
};
const updateCache = (filePath, lines, startByteOfLines) => {
  let cacheLines = _formatCacheLines(lines, startByteOfLines);

  if (CACHE[filePath]) {
    let currentCacheLines = CACHE[filePath];

    if (cacheLines[0].startsAtByte < currentCacheLines[0].startsAtByte) {
      if (
        cacheLines[cacheLines.length - 1].startsAtByte <
        currentCacheLines[0].startsAtByte
      ) {
        // # 1
        CACHE[filePath] = [...cacheLines, ...CACHE[filePath]];
      } else {
        // # 2
      }
    } else if (
      cacheLines[cacheLines.length - 1].startsAtByte >
      currentCacheLines[currentCacheLines.length - 1].startsAtByte
    ) {
    } else {
      // # 5
    }

    /*
    current: x ... y

    new: a ... b

    #1 a ... b .. x ... y
    #2 a .. x .. b .. y

    #3 x ... y .. a ... b
    #4 x .. a .. y .. b

    #5 x .. a ... b .. y

    a < x => new starts before current
      #1 b < x => new is entirely before current
      #2 b > x => new is partially before current
    b > y => new ends after current
      #3 a > y => new ends entirely after current
      #4 a < y => new ends partially after current
    #5 a > x && b < y === !(a < x) && !(b > y) => new is contained within current
    */
  } else {
    CACHE[filePath] = [...cacheLines];
  }
};
const flushCache = data => {};
const _checkCacheSize = cache => {
  /*check if cache has reached the limit of 100mb*/
};

const _formatCacheLines = (lines, startByteOfLines) => {
  return lines.map((line, index) => {
    return { line: line, startsAtByte: startByteOfLines[index] };
  });
};

module.exports = {
  createCache,
  updateCache,
  flushCache,
  searchCache
};
