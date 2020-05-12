import {
  updateCache,
  flushCache,
  flushCacheForOneFile,
  searchCache,
  checkIfCacheIsWithinSizeLimit
} from './cache';

describe('searchCache', () => {
  afterEach(() => {
    flushCache();
  });

  it('should return miss if filepath does not exist', () => {
    const result = searchCache('testpath', 0, 5, 50);
    const expectedResult = 'miss';
    expect(result).toEqual(expectedResult);
  });

  it('should return end of file with the specified amount of lines when position is close to the end', () => {
    const filepath = 'testpath';
    const fileSize = 50;
    const lines1 = ['rad01', 'rad02', 'rad03', 'rad04', 'rad05'];
    const lines2 = ['rad09', 'rad10', 'rad11', 'rad12'];
    const startByteOfLines = [0, 5, 10, 15, 20];
    const startByteOfLines2 = [30, 35, 40, 45];
    const bytePosition = 41;
    const amountOfLines = 3;

    updateCache(filepath, lines1, startByteOfLines);
    updateCache(filepath, lines2, startByteOfLines2);

    const result = searchCache(filepath, bytePosition, amountOfLines, fileSize);

    const expectedResult = {
      lines: ['rad10', 'rad11', 'rad12'],
      startsAtByte: [35, 40, 45],
      isEndOfFile: true
    };

    expect(result).toEqual(expectedResult);
  });

  it('should return the beginning of the file when byte position is 0', () => {
    const filepath = 'testpath';
    const fileSize = 50;
    const lines1 = ['rad01', 'rad02', 'rad03', 'rad04', 'rad05'];
    const lines2 = ['rad09', 'rad10', 'rad11', 'rad12'];
    const startByteOfLines = [0, 5, 10, 15, 20];
    const startByteOfLines2 = [30, 35, 40, 45];
    const bytePosition = 0;
    const amountOfLines = 4;

    updateCache(filepath, lines1, startByteOfLines);
    updateCache(filepath, lines2, startByteOfLines2);

    const result = searchCache(filepath, bytePosition, amountOfLines, fileSize);

    const expectedResult = {
      lines: ['rad01', 'rad02', 'rad03', 'rad04'],
      startsAtByte: [0, 5, 10, 15],
      isEndOfFile: false
    };

    expect(result).toEqual(expectedResult);
  });

  it('should return miss when cached chunk is too short', () => {
    const filepath = 'testpath';
    const fileSize = 50;
    const lines1 = ['rad01', 'rad02', 'rad03', 'rad04', 'rad05'];
    const lines2 = ['rad09', 'rad10', 'rad11', 'rad12'];
    const startByteOfLines = [0, 5, 10, 15, 20];
    const startByteOfLines2 = [30, 35, 40, 45];
    const bytePosition = 15;
    const amountOfLines = 4;

    updateCache(filepath, lines1, startByteOfLines);
    updateCache(filepath, lines2, startByteOfLines2);

    const result = searchCache(filepath, bytePosition, amountOfLines, fileSize);

    const expectedResult = 'miss';

    expect(result).toEqual(expectedResult);
  });
});

const FILEPATH = 'test/testfile';
const LINES = ['rad 1', 'rad 2'];
const STARTBYTEOFLINES = [10, 20];

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
      isEndOfFile: true,
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
      isEndOfFile: true,
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
      isEndOfFile: true,
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
      isEndOfFile: true,
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
      isEndOfFile: true,
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
    const cache = Buffer.alloc(cacheSize).fill('a').toString();
    expect(checkIfCacheIsWithinSizeLimit(cache)).toEqual(true);
  });

  it('should return false if cache object size is outside limit', () => {
    const cacheSize = 100000001 - BytesAddedByJSONStringify;
    const cache = Buffer.alloc(cacheSize).fill('a').toString();
    expect(checkIfCacheIsWithinSizeLimit(cache)).toEqual(false);
  });

  it('should return false if cache object size is equal to the size limit', () => {
    const cacheSize = 100000000 - BytesAddedByJSONStringify;
    const cache = Buffer.alloc(cacheSize).fill('a').toString();
    expect(checkIfCacheIsWithinSizeLimit(cache)).toEqual(false);
  });
});

describe('flushCache', () => {
  it('should empty the cache object', () => {
    const resultOnHit = {
      isEndOfFile: true,
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
      isEndOfFile: true,
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
