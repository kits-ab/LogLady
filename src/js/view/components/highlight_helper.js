export const findMatches = (wordToMatch, rowArray) => {
  return rowArray.filter(word => {
    const regex = new RegExp(wordToMatch, 'gi');
    return word.match(regex);
  });
};
