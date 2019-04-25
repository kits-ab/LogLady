export const findMatches = (lineFilterInput, lineArray) => {
  return lineArray.filter(line => {
    const regex = new RegExp(lineFilterInput, 'gi');
    return line.match(regex);
  });
};
