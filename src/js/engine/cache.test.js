import {
  updateCache,
  searchCache,
  flushCache,
  flushCacheForOneFile,
  checkIfCacheIsWithinSizeLimit
} from './cache';

const FILEPATH = 'test/testfile';
const LINES = ['rad 1', 'rad 2'];
const STARTBYTEOFLINES = [10, 20];
const POSITION = 15;
//TODO: Make the tests work with the new search cache logic
describe('', () => {
  it('', () => {});
});
describe('searchCache', () => {
  beforeEach(() => {
    updateCache(FILEPATH, LINES, STARTBYTEOFLINES);
  });
  afterEach(() => {
    flushCache();
  });

  it('should return miss', () => {
    expect(searchCache(FILEPATH, 21, 10)).toEqual('miss');
  });

  it('should return expected result', () => {
    const expectedResult = {
      lines: ['rad 2'],
      startsAtByte: [20]
    };
    expect(searchCache(FILEPATH, POSITION, 1)).toEqual(expectedResult);
  });
});

describe('updateCache', () => {
  beforeEach(() => {
    updateCache(FILEPATH, LINES, STARTBYTEOFLINES);
  });

  afterEach(() => {
    flushCache();
  });

  it('should add new lines before current', () => {
    const caseCache = {
      filepath: 'test/testfile',
      lines: ['rad 3', 'rad 4', 'rad 5'],
      startByteOfLines: [5, 7, 8],
      position: 5
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

  it('should add new lines partially before current', () => {
    const caseCache = {
      filepath: 'test/testfile',
      lines: ['rad 3', 'rad 4', 'rad 5'],
      startByteOfLines: [5, 7, 15],
      position: 5
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

  it('should add new lines after current', () => {
    const caseCache = {
      filepath: 'test/testfile',
      lines: ['rad 3', 'rad 4'],
      startByteOfLines: [21, 30],
      position: 10
    };
    const expectedResult = {
      lines: ['rad 1', 'rad 2', 'rad 3', 'rad 4'],
      startsAtByte: [10, 20, 21, 30]
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

  it('should add new lines partially after current', () => {
    const caseCache = {
      filepath: 'test/testfile',
      lines: ['rad 3', 'rad 4', 'rad 5'],
      startByteOfLines: [15, 20, 25],
      position: 10
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

  it('should add new lines within current', () => {
    const caseCache = {
      filepath: 'test/testfile',
      lines: ['rad 3', 'rad 4', 'rad 5'],
      startByteOfLines: [13, 16, 19],
      position: 10
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
  const BytesAddedByJSONStringify = 2;
  it('should return true if cache object size is within limit', () => {
    const cacheSize = 99999999 - BytesAddedByJSONStringify;
    const cache = Buffer.alloc(cacheSize)
      .fill('a')
      .toString();
    expect(checkIfCacheIsWithinSizeLimit(cache)).toEqual(true);
  });

  it('should return false if cache object size is outside limit', () => {
    const cacheSize = 100000001 - BytesAddedByJSONStringify;
    const cache = Buffer.alloc(cacheSize)
      .fill('a')
      .toString();
    expect(checkIfCacheIsWithinSizeLimit(cache)).toEqual(false);
  });

  it('should return false if cache object size is equal to the size limit', () => {
    const cacheSize = 100000000 - BytesAddedByJSONStringify;
    const cache = Buffer.alloc(cacheSize)
      .fill('a')
      .toString();
    expect(checkIfCacheIsWithinSizeLimit(cache)).toEqual(false);
  });
});

describe('flushCache', () => {
  it('should empty the cache object', () => {
    const resultOnHit = {
      lines: ['rad 1'],
      startsAtByte: [10]
    };
    const resultOnMiss = 'miss';
    updateCache(FILEPATH, LINES, STARTBYTEOFLINES);
    expect(searchCache(FILEPATH, 10, 1)).toEqual(resultOnHit);
    flushCache();
    expect(searchCache(FILEPATH, 10, 1)).toEqual(resultOnMiss);
  });
});

describe('flushCacheForOneFile', () => {
  beforeEach(() => {
    updateCache(FILEPATH, LINES, STARTBYTEOFLINES);
  });
  afterEach(() => {
    flushCache();
  });
  it('should remove cache for one file', () => {
    const filepath = 'folder/file.log';
    const lines = ['rad 1', 'rad 2'];
    const startByteOfLines = [0, 2];
    const resultOnHit = {
      lines: ['rad 1'],
      startsAtByte: [0]
    };
    const resultOnMiss = 'miss';
    updateCache(filepath, lines, startByteOfLines);
    expect(searchCache(filepath, 0, 1)).toEqual(resultOnHit);
    flushCacheForOneFile(filepath);
    expect(searchCache(filepath, 0, 1)).toEqual(resultOnMiss);
  });
});
