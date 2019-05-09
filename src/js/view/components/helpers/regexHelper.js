/**
 * Returns an array of matched and unmatched objects (if they are adjacent) with order preserved
 * A returned array can look like the following [{matched: false, text: 'The quick brown '},  {matched: true, text: ' jumped over the fox something something'}, {matched: false, text: ' and haha'}]
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
      array[array.length - 1].text += match;
    } else if (match) {
      //normal text are strings and higlighted items are wrapped in an object so that we can see what text got highlighted later
      if (textBeforeMatch)
        array.push({ matched: false, text: textBeforeMatch });

      array.push({ matched: true, text: match });
    } else {
      break; //can't do much if it matches ''
    }

    //update input without the text added
    input = input.slice(textBeforeMatch.length + match.length);
  }

  //add the text after the last match
  if (input) array.push({ matched: false, text: input });

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
