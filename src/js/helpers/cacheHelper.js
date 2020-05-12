const formatCacheLines = (lines, startByteOfLines) => {
  return lines.map((line, index) => {
    return { line: line, startsAtByte: startByteOfLines[index] };
  });
};

const formatCachedPartsInfo = startByteOfLines => {
  const startsAt = startByteOfLines[0];
  const endsAt = startByteOfLines[startByteOfLines.length - 1];
  return [{ startsAt, endsAt, startByteOfLines }];
};

const parseResult = (result, fileSize) => {
  const startsAtByte = result.map(byte => {
    return byte.startsAtByte;
  });
  const lines = result.map(line => {
    return line.line;
  });
  const isEndOfFile = isResultEndOfFile(
    fileSize,
    startsAtByte[startsAtByte.length - 1],
    lines[lines.length - 1]
  );
  return { lines, startsAtByte, isEndOfFile };
};

const isResultEndOfFile = (fileSize, lastLineStartsAtByte, lastLine) => {
  const newLineBytes = 2;
  return (
    lastLineStartsAtByte + Buffer.byteLength(lastLine) + newLineBytes >=
    fileSize
  );
};

module.exports = {
  formatCacheLines,
  formatCachedPartsInfo,
  parseResult,
  isResultEndOfFile
};
