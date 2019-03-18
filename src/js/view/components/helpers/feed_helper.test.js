import { filterMatchingRows } from './feed_helper';

describe('filterMatchingRows', () => {
  test('should return correct number of data points', () => {
    const filterText = '';
    const rows = '123\n234\n345\n456\n';
    const result = filterMatchingRows(filterText, rows);
    expect(result).toEqual(['123', '234', '345', '456']);
  });
  test('should return correct number of data points', () => {
    const filterText = '';
    const rows = '123\n234\n345\n456';
    const result = filterMatchingRows(filterText, rows);
    expect(result).toEqual(['123', '234', '345', '456']);
  });
  test('should return correct number of data points', () => {
    const filterText = '';
    const rows = '123\n234\n\n345\n456';
    const result = filterMatchingRows(filterText, rows);
    expect(result).toEqual(['123', '234', '', '345', '456']);
  });
});
