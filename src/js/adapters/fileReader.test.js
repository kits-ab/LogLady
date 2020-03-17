import {
  getFileSizeInBytes,
  parseLines,
  countLinesInBuffer,
  readDataFromByte,
  extractStartByteOfLinesFromByteData,
  parseByteDataIntoStringArray
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

describe('readDataFromByte', () => {
  it('should return an object with the expected content', async () => {
    const filePath = 'src/resources/logFileForTests';
    const startReadFromByte = 0;
    const numberOfBytes = 500;
    const expectedResult = {
      startByteOfLines: [0, 115, 232, 344],
      lines: [
        '2020-02-03 14:50:17.916  INFO  16639 --- [        Thread1] o.s.d.r.w.RepositoryRestHandlerAdapter   : Changed data',
        '2020-02-03 14:50:18.252  INFO  379   --- [        Thread2] o.s.b.w.embedded.tomcat.TomcatWebServer  : info message 1',
        '2020-02-03 14:50:18.588  INFO  3675  --- [        Thread1] o.s.d.r.w.RepositoryRestHandlerMapping   : Forbidden',
        '2020-02-03 14:50:18.926  INFO  12772 --- [        Thread1] o.s.d.r.w.RepositoryRestHandlerMapping   : Changed data'
      ],
      linesStartAt: 0,
      linesEndAt: 459
    };
    const testResult = await readDataFromByte(
      filePath,
      startReadFromByte,
      numberOfBytes
    );

    expect(testResult).toEqual(expectedResult);
  });

  it('should not return first row when byte to read from starts after 0 and before new line', async () => {
    const filePath = 'src/resources/logFileForTests';
    const startReadFromByte = 20;
    const numberOfBytes = 500;
    const expectedResult = {
      startByteOfLines: [115, 232, 344],
      lines: [
        '2020-02-03 14:50:18.252  INFO  379   --- [        Thread2] o.s.b.w.embedded.tomcat.TomcatWebServer  : info message 1',
        '2020-02-03 14:50:18.588  INFO  3675  --- [        Thread1] o.s.d.r.w.RepositoryRestHandlerMapping   : Forbidden',
        '2020-02-03 14:50:18.926  INFO  12772 --- [        Thread1] o.s.d.r.w.RepositoryRestHandlerMapping   : Changed data'
      ],
      linesStartAt: 115,
      linesEndAt: 459
    };
    const testResult = await readDataFromByte(
      filePath,
      startReadFromByte,
      numberOfBytes
    );
    expect(testResult.startByteOfLines[0]).not.toEqual(startReadFromByte);
    expect(testResult).toEqual(expectedResult);
  });

  it('should return result with startByteOfLines[0] and linesStartAt being the same value', async () => {
    const filePath = 'src/resources/logFileForTests';
    const startReadFromByte = 115;
    const numberOfBytes = 500;

    const testResult = await readDataFromByte(
      filePath,
      startReadFromByte,
      numberOfBytes
    );

    expect(testResult.startByteOfLines[0]).toEqual(testResult.linesStartAt);
  });
});

describe('extractStartByteOfLinesFromByteData', () => {
  it('should return an array with the correct startbyte calculations', () => {
    const lines = ['abc', 'cde', 'efgh'];
    const startByteOfLines = 0;
    const result = extractStartByteOfLinesFromByteData(lines, startByteOfLines);
    const expectedResult = [0, 4, 8];
    expect(result).toEqual(expectedResult);
  });
});

describe('parseByteDataIntoStringArray', () => {
  it('should return an array containing the lines from a text separated by newline', async () => {
    const text = 'hello\r\nworld\r\nhello\r\nworld\r\n';
    const textStartsAtByte = 0;
    const nrOfBytes = Buffer.byteLength(text);
    const result = parseByteDataIntoStringArray(
      text,
      textStartsAtByte,
      nrOfBytes
    );
    const expectedResult = ['hello', 'world', 'hello', 'world'];
    expect(result.lines).toEqual(expectedResult);
  });
});

describe('getFileSizeInBytes', () => {
  it('should return the correct size value', () => {
    const actualFileSize = 394855;
    const result = getFileSizeInBytes('src/resources/logFileForTests');
    expect(result).toEqual(actualFileSize);
  });
});
