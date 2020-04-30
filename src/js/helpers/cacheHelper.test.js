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
  it('', () => {});
});

describe('formatCachedPartsInfo', () => {
  it('', () => {});
});

describe('parseResult', () => {
  it('', () => {});
});
