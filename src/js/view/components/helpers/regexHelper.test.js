import {
  groupByMatches,
  isEscapedRegexString,
  escapeRegexString,
  filterByRegex
} from './regexHelper';

describe('regex helper', () => {
  it('should match the whole string', () => {
    const string = 'The quick brown fox jumps over the lazy dog.';
    const regex = /./;
    const expectedResult = [{ matched: true, text: string }];

    expect(groupByMatches(string, regex)).toEqual(expectedResult);
  });

  it('should group adjacent matches in string', () => {
    const stringArray = ['bbbbbbbb', 'aba', 'bbbbb', 'aba', 'bbbb'];
    const string = stringArray.join('');
    const regex = /a.a/;
    const expectedResult = [
      { matched: false, text: stringArray[0] },
      { matched: true, text: stringArray[1] },
      { matched: false, text: stringArray[2] },
      { matched: true, text: stringArray[3] },
      { matched: false, text: stringArray[4] }
    ];

    expect(groupByMatches(string, regex)).toEqual(expectedResult);
  });

  it('should be able to handle empty string', () => {
    const string = '';
    const regex = /.*/;
    const expectedResult = [];

    expect(groupByMatches(string, regex)).toEqual(expectedResult);
  });

  it('should be able to handle no matches', () => {
    const string = 'bbbbbbbbbbbbbbbbbbb';
    const regex = /a/;
    const expectedResult = [{ matched: false, text: string }];

    expect(groupByMatches(string, regex)).toEqual(expectedResult);
  });

  it('should show as escapedString', () => {
    const string = '@helloimnormaltext';
    const escapeSequence = '@';

    expect(isEscapedRegexString(string, escapeSequence)).toEqual(true);
  });

  it('should show as nonescapedString', () => {
    const string = '@helloimnormaltext';
    const escapeSequence = '%';

    expect(isEscapedRegexString(string, escapeSequence)).toEqual(false);
  });
});
