import { updateLogViewerCache } from './cacheHelper';

describe('updateLogViewerCache', () => {
  it('should add new lines from index 0', () => {
    const totalCacheLength = 8;
    const newLines = ['c', 'd', 'a'];
    const startIndex = 0;
    const expectedResult = ['c', 'd', 'a', '.', '.', '.', '.', '.'];
    const result = updateLogViewerCache(totalCacheLength).insertRows(
      startIndex,
      newLines
    );
    expect(result).toEqual(expectedResult);
  });

  it('should add all new lines to the end and stay the same size if startIndex + length of new lines is bigger than size of cache', () => {
    const totalCacheLength = 8;
    const newLines = ['c', 'd', 'e'];
    const startIndex = 7;
    const expectedResult = ['.', '.', '.', '.', '.', 'c', 'd', 'e'];
    const result = updateLogViewerCache(totalCacheLength).insertRows(
      startIndex,
      newLines
    );
    expect(result).toEqual(expectedResult);
  });

  it('should add lines to index in the middle of the cache', () => {
    const totalCacheLength = 8;
    const newLines = ['c', 'd', 'e'];
    const startIndex = 3;
    const expectedResult = ['.', '.', '.', 'c', 'd', 'e', '.', '.'];
    const result = updateLogViewerCache(totalCacheLength).insertRows(
      startIndex,
      newLines
    );
    expect(result).toEqual(expectedResult);
  });

  it('should add lines from index 0 if the startIndex is less than 0', () => {
    const totalCacheLength = 8;
    const newLines = ['a', 'b', 'c'];
    const startIndex = -3;
    const expectedResult = ['a', 'b', 'c', '.', '.', '.', '.', '.'];
    const result = updateLogViewerCache(totalCacheLength).insertRows(
      startIndex,
      newLines
    );
    expect(result).toEqual(expectedResult);
  });
});
