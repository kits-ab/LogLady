export const findMatches = (lineFilterInput, lineArray) => {
  return lineArray.filter(line => {
    try {
      const regex = new RegExp(lineFilterInput, 'gi');
      return line.match(regex);
    } catch (e) {
      return false;
    }
  });
};
