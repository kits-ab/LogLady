/**
 * Returns an array of strings and matches grouped together (if they are adjacent) with order preserved
 * Grouped matches are in the form of an object with one field group { group: ''}
 * A returned array can look like the following ['The quick brown ', { group: 'fox something something' }, ' ran over something something']
 * @param {string} string
 * @param {RegExp} regex
 */
export const groupByMatches = (string, regex) => {
  if (!regex) return [string];

  let array = [];
  let result;
  let input = string;

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

/**
 * Returns true if the string is considered escaped, and should be treated as normal text
 * @param {string} string
 * @param {string} escapePrefix
 */
export const isEscapedRegexString = (string, escapePrefix) => {
  return string.startsWith(escapePrefix);
};

/**
 * Removes escape prefix from string and escapes all special regex characters
 * @param {string} string
 * @param {string} escapePrefix
 */
export const escapeRegexString = (string, escapePrefix) => {
  return string
    .slice(escapePrefix.length)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); //Escape all special characters
};

/**
 * Filters each string in a list by a regex
 * @param {string[]} strings
 * @param {RegExp} regex
 */
export const filterByRegex = (strings, regex) => {
  if (!regex) return strings;

  return strings.filter(string => {
    return regex.test(string);
  });
};
