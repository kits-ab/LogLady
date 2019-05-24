import { getFormattedFilePath } from './StatusBarHelper';

describe('getFormattedFilePath', () => {
  it('should return and split filepath for windows', () => {
    const filePath = 'bla\\test\\filepath\\for\\windows.log';
    const expectedResult = '...filepath\\for\\windows.log';
    expect(getFormattedFilePath(filePath, '\\')).toEqual(expectedResult);
  });

  it('should return and split filepath for linux and mac', () => {
    const filePath = 'bla/test/filepath/for/windows.log';
    const expectedResult = '...filepath/for/windows.log';
    expect(getFormattedFilePath(filePath, '/')).toEqual(expectedResult);
  });

  it('should return the whole path for windows', () => {
    const filePath = 'test\\filepath\\for\\windows.log';
    const expectedResult = 'test\\filepath\\for\\windows.log';
    expect(getFormattedFilePath(filePath, '\\')).toEqual(expectedResult);
  });

  it('should return the whole path for linux and mac', () => {
    const filePath = 'test/filepath/for/windows.log';
    const expectedResult = 'test/filepath/for/windows.log';
    expect(getFormattedFilePath(filePath, '/')).toEqual(expectedResult);
  });
});
