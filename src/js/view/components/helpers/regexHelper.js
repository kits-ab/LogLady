/**
 * Returns an array of matched and unmatched objects (if they are adjacent) with order preserved
 * A returned array can look like the following [{matched: false, text: 'The quick brown '},  {matched: true, text: ' jumped over the fox something something'}, {matched: false, text: ' and haha'}]
 * @param {string} string
 * @param {RegExp} regex
 * @returns {object[]} Returns an array with the objects { matched: bool, test: string}
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
    if (!result.groups && !textBeforeMatch && array.length > 0) {
      array[array.length - 1].text += match;
    } else if (match) {
      //normal text are strings and higlighted items are wrapped in an object so that we can see what text got highlighted later
      if (textBeforeMatch)
        array.push({ matched: false, text: textBeforeMatch });

      // Push only named group text if matched and available, otherwise entire match
      array.push({
        matched: true,
        text: (result.groups && result.groups.text) || match
      });
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
 * @returns {boolean} True if it's escaped otherwise false
 */
export const isEscapedRegExpString = (string, escapePrefix) => {
  return !!(string && escapePrefix && string.startsWith(escapePrefix));
};

/**
 * Escapes all special RegExp characters
 * @param {string} string
 * @returns {string} String with all RegExp characters escaped
 */
export const escapeRegExpString = string => {
  return string.replace(/[.*+?^${}()=!:<>\-|[\]\\]/g, '\\$&'); //Escape all special characters
};

/**
 * Removes the escape sequence from the string or does nothing if it isn't escaped
 * @param {string} string
 * @param {string} escapeSequence
 * @returns {string} The string without the escape sequence
 */
export const removeRegExpEscapeSequence = (string, escapeSequence) => {
  if (string.startsWith(escapeSequence)) {
    return string.slice(escapeSequence.length);
  }

  return string;
};

/**
 * Filters each string in a list by a regex
 * @param {string[]} strings
 * @param {RegExp} regex
 * @returns {string[]} All strings matching regex
 */
export const filterByRegExp = (strings, regex) => {
  if (!regex) return strings;

  return strings.filter(string => {
    return regex.test(string);
  });
};

/**
 * Parses an input and creates a regex, the input can be escaped if the string begins with the escapeSequence
 * If the input is empty or is unable to create a RegExp, undefined is returned
 * The created RegExp is by default case insensitive
 * @param {string} input
 * @param {string} escapeSequence
 * @returns {RegExp | undefined} Returns a case insensitive RegExp or undefined if not possible
 */
export const parseRegExp = (input, escapeSequence = '@') => {
  let regexString = escapeRegExpString(input);

  if (isEscapedRegExpString(input, escapeSequence)) {
    regexString = removeRegExpEscapeSequence(input, escapeSequence);
  }

  if (!regexString) return undefined;

  try {
    return new RegExp(regexString, 'i');
  } catch (e) {
    return undefined;
  }
};
