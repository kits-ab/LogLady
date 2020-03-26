import { initializeCache, calculatePositionInFile } from './cacheHelper';

const cache = initializeCache(2);

describe('initializeCache', () => {
  test('1 adds multiple rows starting at index', () => {
    const theList = [...new Array(10), ...[1, 2, 3, 4, 5]];
    const resultList = [1, 2, ...new Array(13)];

    expect(cache.insertRows(theList, 0, [1, 2, 3, 4, 5])).toEqual(resultList);
  });

  test('2 adds multiple rows starting at index', () => {
    const theList = [...new Array(10), ...[1, 2, 3, 4, 5]];
    const resultList = [1, 2, 3, 4, 5, ...new Array(10)];

    expect(initializeCache(7).insertRows(theList, 0, [1, 2, 3, 4, 5])).toEqual(
      resultList
    );
  });

  test('3 adds multiple rows starting at index', () => {
    const theList = [...new Array(10), ...[1, 2, 3, 4, 5]];
    const resultList = [...new Array(11), 2, 3, 4, 5, 6, 7];
    const actualResult = initializeCache(6).insertRows(theList, 15, [6, 7]);
    expect(actualResult).toEqual(resultList);
  });

  test('4 adds multiple rows starting at index', () => {
    const theList = [...new Array(10), ...[1, 2, 3, 4, 5]];
    const resultList = [1, 2, ...new Array(13)];

    const changedList = cache.insertRows(theList, 0, [1, 2, 3, 4, 5]);
    expect(changedList).toEqual(resultList);

    const nextResultList = [...new Array(7), 'a', 'b', ...new Array(6)];
    expect(cache.insertRows(changedList, 7, ['a', 'b', 'c'])).toEqual(
      nextResultList
    );
  });
});

describe('calculatePositonInFile', () => {
  it('should return position 0 if scrollTop is 0 (at the top)', () => {
    const scrollTop = 0;
    const clientHeight = 100;
    const scrollHeight = 1000;
    const logSize = 10000;
    const result = calculatePositionInFile(
      scrollTop,
      clientHeight,
      scrollHeight,
      logSize
    );
    const expectedResult = 0;
    expect(result).toEqual(expectedResult);
  });
  it('should return a position which equals logsize, if scrollTop is equal to scrollHeight - clientHeight (at the bottom)', () => {
    const scrollTop = 1000;
    const clientHeight = 100;
    const scrollHeight = 1100;
    const logSize = 1000;
    const result = calculatePositionInFile(
      scrollTop,
      clientHeight,
      scrollHeight,
      logSize
    );
    expect(result).toEqual(logSize);
  });
  it('should return halved logSize value, if scrollTop is the middle value of scrollHeight - clientHeight', () => {
    const scrollTop = 500;
    const clientHeight = 100;
    const scrollHeight = 1100;
    const logSize = 1000;
    const result = calculatePositionInFile(
      scrollTop,
      clientHeight,
      scrollHeight,
      logSize
    );
    expect(result).toEqual(logSize / 2);
  });
});
