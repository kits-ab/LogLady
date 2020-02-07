import {
  parseLines,
  parseLinesBackwards,
  countLinesInBuffer,
  readDataFromByte
} from './fileReader';

describe('parseLines', () => {
  it('should account get all LF lines', () => {
    const chunk = 'why\nhello\nthere\n';
    const trailingChars = '';
    const expectedResult = [['why', 'hello', 'there'], ''];

    expect(parseLines(chunk, trailingChars)).toEqual(expectedResult);
  });
  it('should get all CRLF lines', () => {
    const chunk = 'why\r\nhello\r\nthere\r\n';
    const trailingChars = '';
    const expectedResult = [['why', 'hello', 'there'], ''];

    expect(parseLines(chunk, trailingChars)).toEqual(expectedResult);
  });
  it('should return unused characters with lines', () => {
    const chunk = 'why\nhello\nthere\nmy little friend';
    const trailingChars = '';
    const expectedResult = [['why', 'hello', 'there'], 'my little friend'];

    expect(parseLines(chunk, trailingChars)).toEqual(expectedResult);
  });
  it('should return unused characters if no lines', () => {
    const chunk = 'my little friend';
    const trailingChars = '';
    const expectedResult = [[], 'my little friend'];

    expect(parseLines(chunk, trailingChars)).toEqual(expectedResult);
  });
  it('should add trailing chars to new line', () => {
    const chunk = '\ni donno\n';
    const trailingChars = 'mymywhatdowehavehere';
    const expectedResult = [['mymywhatdowehavehere', 'i donno'], ''];

    expect(parseLines(chunk, trailingChars)).toEqual(expectedResult);
  });

  it('should account check for CRLF including trailing characters', () => {
    const chunk = '\nworld\r\n';
    const trailingChars = 'hello\r';
    const expectedResult = [['hello', 'world'], ''];

    expect(parseLines(chunk, trailingChars)).toEqual(expectedResult);
  });
});

describe('parseLinesBackwards', () => {
  it('should account get all LF lines', () => {
    const chunk = '\nwhy\nhello\nthere';
    const trailingChars = '';
    const expectedResult = [['why', 'hello', 'there'], ''];

    expect(parseLinesBackwards(chunk, trailingChars)).toEqual(expectedResult);
  });
  it('should get all CRLF lines', () => {
    const chunk = '\r\nwhy\r\nhello\r\nthere';
    const trailingChars = '';
    const expectedResult = [['why', 'hello', 'there'], ''];

    expect(parseLinesBackwards(chunk, trailingChars)).toEqual(expectedResult);
  });
  it('should return unused characters with lines', () => {
    const chunk = 'why\nhello\nthere\nmy little friend';
    const trailingChars = '';
    const expectedResult = [['hello', 'there', 'my little friend'], 'why'];

    expect(parseLinesBackwards(chunk, trailingChars)).toEqual(expectedResult);
  });
  it('should return unused characters if no lines', () => {
    const chunk = 'my little friend';
    const trailingChars = '';
    const expectedResult = [[], 'my little friend'];

    expect(parseLinesBackwards(chunk, trailingChars)).toEqual(expectedResult);
  });
  it('should add trailing chars to new line', () => {
    const chunk = '\ni donno\n';
    const trailingChars = 'mymywhatdowehavehere';
    const expectedResult = [['i donno', 'mymywhatdowehavehere'], ''];

    expect(parseLinesBackwards(chunk, trailingChars)).toEqual(expectedResult);
  });

  it('should account check for CRLF including trailing characters', () => {
    const chunk = '\r\nworld\r';
    const trailingChars = '\nhello';
    const expectedResult = [['world', 'hello'], ''];

    expect(parseLinesBackwards(chunk, trailingChars)).toEqual(expectedResult);
  });
});

describe('countLinesInBuffer', () => {
  it('should count the correct amount of LF lines', () => {
    const string = Buffer.from('please\nsend\nhelp\nfor\nme\n', 'utf-8');
    const expectedResult = 5;

    expect(countLinesInBuffer(string)).toEqual(expectedResult);
  });
  it('should count the correct amount of CRLF lines', () => {
    const string = Buffer.from(
      'hello\r\nworld\r\nhow\rreturn\r\nare\r\nyou\r\n?\r\nok\r\n',
      'utf-8'
    );
    const expectedResult = 7;

    expect(countLinesInBuffer(string)).toEqual(expectedResult);
  });
});

describe('Fetching a buffer from a file', () => {
  it('should not take too long', () => {
    return readDataFromByte('src\\resources\\testFile', 100000, 1000).then(
      data => {
        console.log(data.lines);
        console.log(data.linesStartAt);
        console.log(data.linesEndAt);
      }
    );
  });
});
