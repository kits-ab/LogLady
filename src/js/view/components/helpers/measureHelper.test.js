import { calculateWrap, maxLengthReducer } from './measureHelper';

describe('calculateSize', () => {});
describe('calculateWrap', () => {
  it('should be undefined if the width is 0', () => {
    const text = '';
    const charSize = [0, 0];
    const elementWidth = 0;
    const expectedResult = undefined;

    expect(calculateWrap(text, charSize, elementWidth)).toEqual(expectedResult);
  });

  it('should be undefined if the width is < 0', () => {
    const text = '';
    const charSize = [0, 0];
    const elementWidth = -1;
    const expectedResult = undefined;

    expect(calculateWrap(text, charSize, elementWidth)).toEqual(expectedResult);
  });

  it('should be wrapped by width', () => {
    const text = '0123456789';
    const charSize = [4, 1];
    const elementWidth = 5;
    const expectedResult = 8;

    expect(calculateWrap(text, charSize, elementWidth)).toEqual(expectedResult);
  });

  it('should contain not full rows', () => {
    const text = '01234567891';
    const charSize = [4, 1];
    const elementWidth = 5;
    const expectedResult = 12;

    expect(calculateWrap(text, charSize, elementWidth)).toEqual(expectedResult);
  });

  it('should be undefined if the charWidth is higher than the elementWidth', () => {
    const text = '123';
    const charSize = [1, 100];
    const elementWidth = 1;
    const expectedResult = undefined;

    expect(calculateWrap(text, charSize, elementWidth)).toEqual(expectedResult);
  });
});

describe('maxLengthReducer', () => {
  it('should return start value', () => {
    const array = [];
    const startValue = 5;
    const expectedResult = 5;

    expect(array.reduce(maxLengthReducer, startValue)).toEqual(expectedResult);
  });
  it('should return maximum length', () => {
    const array = ['123123123', '123', '132575684566qdsfdasf', '235'];
    const expectedResult = 20;

    expect(array.reduce(maxLengthReducer, 0)).toEqual(expectedResult);
  });

  it('should ignore undefined values', () => {
    const array = ['12', '123', undefined, '123123123'];
    const expectedResult = 9;

    expect(array.reduce(maxLengthReducer, 0)).toEqual(expectedResult);
  });

  it('should ignore values without length', () => {
    const array = ['ju', '123', {}, '235', '123123123'];
    const expectedResult = 9;

    expect(array.reduce(maxLengthReducer, 0)).toEqual(expectedResult);
  });

  it('should work on arrays', () => {
    const array = [[1, 2, 3], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [4, 5, 6, 7]];
    const expectedResult = 10;

    expect(array.reduce(maxLengthReducer, 0)).toEqual(expectedResult);
  });

  it('should work on mixed objects', () => {
    const array = [
      'hejhjejejhje',
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      { length: 100 }
    ];
    const expectedResult = 100;

    expect(array.reduce(maxLengthReducer, 0)).toEqual(expectedResult);
  });

  it('should ignore numbers', () => {
    const array = [1, 2, 3, '123', 100];
    const expectedResult = 3;

    expect(array.reduce(maxLengthReducer, 0)).toEqual(expectedResult);
  });
});
