const { addRecentFile } = require('./recentFilesHelper');

describe('addRecentFile', () => {
  it('should add up to and including size', () => {
    let recentFiles = [];
    const files = ['file1', 'file2', 'file3', 'file4'];
    const expectedResult = ['file4', 'file3', 'file2', 'file1'];

    for (let i = 0; i < files.length; i++) {
      recentFiles = addRecentFile(recentFiles, files[i], 4);
      expect(recentFiles).toEqual(expectedResult.slice(files.length - i - 1));
    }
  });

  it('should remove oldest when oversized', () => {
    let recentFiles = [];
    recentFiles = addRecentFile(recentFiles, 'file3', 3); //This is oldest, because it was added first
    recentFiles = addRecentFile(recentFiles, 'file2', 3);
    recentFiles = addRecentFile(recentFiles, 'file1', 3);

    const expectedResult = ['file4', 'file1', 'file2'];

    expect(addRecentFile(recentFiles, 'file4', 3)).toEqual(expectedResult);
  });

  it('should add file at the start', () => {
    const recentFiles = ['file3', 'file2', 'file1'];
    const expectedResult = ['file4', 'file3', 'file2', 'file1'];

    expect(addRecentFile(recentFiles, 'file4', 4)).toEqual(expectedResult);
  });

  it('should not create duplicates', () => {
    const recentFiles = ['file3', 'file2', 'file1'];
    const expectedResult = ['file3', 'file2', 'file1'];

    expect(addRecentFile(recentFiles, 'file3', 4)).toEqual(expectedResult);
  });

  it('should still make most recent if duplicate exists', () => {
    const recentFiles = ['file3', 'file2', 'file1'];
    const expectedResult = ['file2', 'file3', 'file1'];

    expect(addRecentFile(recentFiles, 'file2', 4)).toEqual(expectedResult);
  });

  it("should throw error if recent files isn't an array", () => {
    const recentFiles = undefined;

    expect(() => {
      addRecentFile(recentFiles, 'file1');
    }).toThrow();
  });

  it('should not mutate original array', () => {
    const original = [];
    const recentFiles = addRecentFile(original, 'file1');

    expect(original).toEqual([]);
    expect(recentFiles).toEqual(['file1']);
  });
});
