const {
  formatCacheLines,
  formatCachedPartsInfo,
  parseResult,
  isResultEndOfFile
} = require('../helpers/cacheHelper');

describe('isResultEndOfFile', () => {
  it('should return true if last line is at the end of the file', () => {
    const fileSize = 100;
    const lastLineStartByte = 96;
    const lastLine = 'Hej';
    expect(isResultEndOfFile(fileSize, lastLineStartByte, lastLine)).toBe(true);
  });

  it('should return false if last line is before the end of the file', () => {
    const fileSize = 100;
    const lastLineStartByte = 90;
    const lastLine = 'Hej ';
    expect(isResultEndOfFile(fileSize, lastLineStartByte, lastLine)).toBe(
      false
    );
  });
});

describe('formatCacheLines', () => {
  it('should return an array with the correct byte info', () => {
    const lines = ['rad01', 'rad02', 'rad03'];
    const startByteOfLines = [0, 5, 10];
    const result = formatCacheLines(lines, startByteOfLines);
    const expectedResult = [
      { line: 'rad01', startsAtByte: 0 },
      { line: 'rad02', startsAtByte: 5 },
      { line: 'rad03', startsAtByte: 10 }
    ];
    expect(result).toEqual(expectedResult);
  });
});

describe('formatCachedPartsInfo', () => {
  it('should return an array with byte range information', () => {
    const startByteOfLines = [0, 5, 10, 15, 20];
    const result = formatCachedPartsInfo(startByteOfLines);
    const expectedResult = [
      { startsAt: 0, endsAt: 20, startByteOfLines: startByteOfLines }
    ];
    expect(result).toEqual(expectedResult);
  });
});

describe('parseResult', () => {
  it('should parse the cached result into an object with two arrays and one boolean', () => {
    const lines = [
      { line: 'hi1', startsAtByte: 0 },
      { line: 'hi2', startsAtByte: 2 }
    ];
    const fileSize = 10;
    const result = parseResult(lines, fileSize);
    const expectedResult = {
      lines: ['hi1', 'hi2'],
      startsAtByte: [0, 2],
      isEndOfFile: false
    };
    expect(expectedResult).toEqual(result);
  });
});
