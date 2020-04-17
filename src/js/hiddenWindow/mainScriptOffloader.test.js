import {
  filterExistsAndMatchesWithLineOrHasFilterNotBeenSet,
  getHighlightedLineIfHighlightExistsAndMatches
} from './mainScriptOffloader';

describe('mainScriptOffLoader', () => {
  it('should return highlighted line', () => {
    const highlightRegex = new RegExp('Hello World');
    const line = 'Line 1: blablabla Hello World';
    const expectedResult = {
      highlightLine: true,
      sections: line.split(highlightRegex).map(value => {
        return {
          text: value,
          highlightSection: highlightRegex.test(value)
        };
      }),
      length: line.length
    };
    expect(
      getHighlightedLineIfHighlightExistsAndMatches(highlightRegex, line)
    ).toEqual(expectedResult);
  });

  it('should not return highlighted line', () => {
    const highlightRegex = new RegExp('Hello World');
    const line = 'Line 1: blablabla';
    const expectedResult = {
      highlightLine: false,
      sections: [{ text: line, highlightSection: false }],
      length: line.length
    };
    expect(
      getHighlightedLineIfHighlightExistsAndMatches(highlightRegex, line)
    ).toEqual(expectedResult);
  });

  it('should return true because filter exists', () => {
    const filterRegex = new RegExp('bla');
    const line = 'Line 1: blablabla';
    const expectedResult = true;
    expect(
      filterExistsAndMatchesWithLineOrHasFilterNotBeenSet(filterRegex, line)
    ).toEqual(expectedResult);
  });

  it('should return length of 0 due to line being undefined', () => {
    const highlightRegex = new RegExp('Hello World');
    const list = new Array(3);
    const line = list[0];
    const expectedResult = {
      highlightLine: false,
      sections: [{ text: line, highlightSection: false }],
      length: 0
    };
    expect(
      getHighlightedLineIfHighlightExistsAndMatches(highlightRegex, line)
    ).toEqual(expectedResult);
  });
});
