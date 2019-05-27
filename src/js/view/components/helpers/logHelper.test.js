import { createHeightReducer, createRegexReducer } from './logHelper';

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
