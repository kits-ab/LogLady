import {
  createHeightReducer,
  createRegexReducer,
  updateLogViewerCache
} from './logHelper';

describe('createHeightReducer', () => {
  it('should create a function', () => {
    expect(typeof createHeightReducer()).toEqual('function');
  });

  describe('reducer', () => {
    it('should reduce heights into object', () => {
      const heights = {};
      const updatedList = ['adff', 'asdfa', 'adff', 'adsfasdkfasdfads'];

      const expectedResult = { '4': 4, '16': 12, '5': 4 };
      expect(
        updatedList.reduce(createHeightReducer([2, 1], 3), heights)
      ).toEqual(expectedResult);
    });
  });
});

describe('createRegexReducer', () => {
  it('should create a function', () => {
    expect(typeof createRegexReducer()).toEqual('function');
  });

  describe('reducer', () => {
    it('should return all on undefined regex', () => {
      const list = [];
      const updatedList = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const expectedResult = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

      expect(updatedList.reduce(createRegexReducer(undefined), list)).toEqual(
        expectedResult
      );
    });

    it('should filter based on regex', () => {
      const list = [];
      const updatedList = ['a', 'a', 'b', 'b', 'ab', 'bd', 'qr', 't', 'agh'];
      const expectedResult = ['a', 'a', 'ab', 'agh'];
      const regex = /a+/;

      expect(updatedList.reduce(createRegexReducer(regex), list)).toEqual(
        expectedResult
      );
    });

    it('should mutate', () => {
      const list = [];
      const updatedList = [1, 2];

      expect(updatedList.reduce(createRegexReducer(undefined), list)).toBe(
        list
      );
    });
  });
});

// describe('updateLogViewerCache', () => {
//   it('should add new lines from index 0', () => {
//     const totalCacheLength = 8;
//     const newLines = ['c', 'd', 'a'];
//     const startIndex = 0;
//     const expectedResult = ['c', 'd', 'a', '.', '.', '.', '.', '.'];
//     const result = updateLogViewerCache(totalCacheLength).insertRows(
//       startIndex,
//       newLines
//     );
//     expect(result).toEqual(expectedResult);
//   });

//   it('should add all new lines to the end and stay the same size if startIndex + length of new lines is bigger than size of cache', () => {
//     const totalCacheLength = 8;
//     const newLines = ['c', 'd', 'e'];
//     const startIndex = 7;
//     const expectedResult = ['.', '.', '.', '.', '.', 'c', 'd', 'e'];
//     const result = updateLogViewerCache(totalCacheLength).insertRows(
//       startIndex,
//       newLines
//     );
//     expect(result).toEqual(expectedResult);
//   });

//   it('should add lines to index in the middle of the cache', () => {
//     const totalCacheLength = 8;
//     const newLines = ['c', 'd', 'e'];
//     const startIndex = 3;
//     const expectedResult = ['.', '.', '.', 'c', 'd', 'e', '.', '.'];
//     const result = updateLogViewerCache(totalCacheLength).insertRows(
//       startIndex,
//       newLines
//     );
//     expect(result).toEqual(expectedResult);
//   });

//   it('should add lines from index 0 if the startIndex is less than 0', () => {
//     const totalCacheLength = 8;
//     const newLines = ['a', 'b', 'c'];
//     const startIndex = -3;
//     const expectedResult = ['a', 'b', 'c', '.', '.', '.', '.', '.'];
//     const result = updateLogViewerCache(totalCacheLength).insertRows(
//       startIndex,
//       newLines
//     );
//     expect(result).toEqual(expectedResult);
//   });
// });
