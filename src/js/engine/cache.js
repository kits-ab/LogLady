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
const updateCache = data => {};
const flushCache = data => {};
const _checkCacheSize = cache => {
  /*check if cache has reached the limit of 100mb*/
};

module.exports = {
  createCache,
  updateCache,
  flushCache,
  searchCache
};
