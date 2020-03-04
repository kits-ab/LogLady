import {
  updateCache,
  searchCache,
  flushCache,
  _checkIfCacheIsWithinSizeLimit
} from './cache';
describe('update cache', () => {
  const cache = {
    filepath: 'test/testfile',
    lines: ['rad 1', 'rad 2'],
    startByteOfLines: [10, 20],
    position: 15
  };

  beforeEach(() => {
    updateCache(cache.filepath, cache.lines, cache.startByteOfLines);
  });

  afterEach(() => {
    flushCache();
  });

  it('searchCache should return miss', () => {
    expect(searchCache(cache.filepath, cache.position, 10)).toEqual('miss');
  });

  it('searchCache should return result', () => {
    const expectedResult = {
      lines: ['rad 2'],
      startsAtByte: [20]
    };

    expect(searchCache(cache.filepath, cache.position, 1)).toEqual(
      expectedResult
    );
  });

  it('updateCache should add new lines before current', () => {
    const caseCache = {
      filepath: 'test/testfile',
      lines: ['rad 3', 'rad 4', 'rad 5'],
      startByteOfLines: [5, 7, 8],
      position: 0
    };

    const expectedResult = {
      lines: ['rad 3', 'rad 4', 'rad 5', 'rad 1', 'rad 2'],
      startsAtByte: [5, 7, 8, 10, 20]
    };

    updateCache(
      caseCache.filepath,
      caseCache.lines,
      caseCache.startByteOfLines
    );
    expect(searchCache(caseCache.filepath, caseCache.position, 5)).toEqual(
      expectedResult
    );
  });

  it('updateCache should add new lines partially before current', () => {
    const caseCache = {
      filepath: 'test/testfile',
      lines: ['rad 3', 'rad 4', 'rad 5'],
      startByteOfLines: [5, 7, 15],
      position: 0
    };

    const expectedResult = {
      lines: ['rad 3', 'rad 4', 'rad 5', 'rad 2'],
      startsAtByte: [5, 7, 15, 20]
    };

    updateCache(
      caseCache.filepath,
      caseCache.lines,
      caseCache.startByteOfLines
    );
    expect(searchCache(caseCache.filepath, caseCache.position, 4)).toEqual(
      expectedResult
    );
  });

  it('updateCache should add new lines after current', () => {
    const caseCache = {
      filepath: 'test/testfile',
      lines: ['rad 3', 'rad 4'],
      startByteOfLines: [21, 30],
      position: 25
    };

    const expectedResult = {
      lines: ['rad 4'],
      startsAtByte: [30]
    };
    updateCache(
      caseCache.filepath,
      caseCache.lines,
      caseCache.startByteOfLines
    );
    expect(searchCache(caseCache.filepath, caseCache.position, 1)).toEqual(
      expectedResult
    );
  });

  it('updateCache should add new lines partially after current', () => {
    const caseCache = {
      filepath: 'test/testfile',
      lines: ['rad 3', 'rad 4', 'rad 5'],
      startByteOfLines: [15, 20, 25],
      position: 0
    };

    const expectedResult = {
      lines: ['rad 1', 'rad 3', 'rad 4', 'rad 5'],
      startsAtByte: [10, 15, 20, 25]
    };

    updateCache(
      caseCache.filepath,
      caseCache.lines,
      caseCache.startByteOfLines
    );
    expect(searchCache(caseCache.filepath, caseCache.position, 4)).toEqual(
      expectedResult
    );
  });

  it('updateCache should add new lines within current', () => {
    const caseCache = {
      filepath: 'test/testfile',
      lines: ['rad 3', 'rad 4', 'rad 5'],
      startByteOfLines: [13, 16, 19],
      position: 0
    };

    const expectedResult = {
      lines: ['rad 1', 'rad 3', 'rad 4', 'rad 5', 'rad 2'],
      startsAtByte: [10, 13, 16, 19, 20]
    };

    updateCache(
      caseCache.filepath,
      caseCache.lines,
      caseCache.startByteOfLines
    );
    expect(searchCache(caseCache.filepath, caseCache.position, 5)).toEqual(
      expectedResult
    );
  });
});

describe('_checkIfCacheIsWithinSizeLimit', () => {
  it('should return true if cache is within limit', () => {
    const cache = {
      filepath: 'test/testfile',
      lines: ['rad 1', 'rad 2'],
      startByteOfLines: [10, 20],
      position: 15
    };
    expect(_checkIfCacheIsWithinSizeLimit(cache)).toEqual(true);
  });
});
