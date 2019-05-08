/**
 * Returns an array of strings and matches grouped together (if they are adjacent) with order preserved
 * Grouped matches are in the form of an object with one field group { group: ''}
 * A returned array can look like the following ['The quick brown ', { group: 'fox something something' }, ' ran over something something']
 * @param {string} text
 * @param {RegExp} regex
 */
export const groupByMatches = (text, regex) => {
  let array = [];
  let result;
  let input = text;

  // read until no more matches
  while (input && (result = regex.exec(input))) {
    const textBeforeMatch = input.slice(0, result.index);
    const match = result[0];

    //if textBeforeMatch is '' it means there was no characters between this match and the previous match, so append it to the previous match
    if (!textBeforeMatch && array.length > 0) {
      array[array.length - 1].group += match;
    } else if (match) {
      //normal text are strings and higlighted items are wrapped in an object so that we can see what text got highlighted later
      array.push(textBeforeMatch);
      array.push({ group: match });
    } else {
      break; //can't do much if it matches ''
    }

    //update input without the text added
    input = input.slice(textBeforeMatch.length + match.length);
  }

  //add the text after the last match
  array.push(input.slice(0));

  return array;
};
