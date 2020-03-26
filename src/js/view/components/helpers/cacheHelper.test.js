import { initializeCache, calculatePositionInFile } from './cacheHelper';

const cache = initializeCache(2);

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

// TODO: make test for position calculation function
// describe('calculatePositonInFile', () => {
//   it('should return the byte position of the file based on the position of the scroller', () => {
//     const result = calculatePositionInFile();
//     const expectedResult = null;
//   });
// });
