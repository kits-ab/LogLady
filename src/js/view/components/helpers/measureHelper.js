/**
 * Puts the text in the ruler HTML element and returns the height and width
 * @param {string} text
 * @param {HTMLElement} ruler
 * @returns {Number[]} [height, width]
 */
export const calculateSize = (text, ruler) => {
  ruler.innerHTML = text;
  return [ruler.offsetHeight, ruler.offsetWidth];
};

/**
 * Returns the height of text given a charSize and an elementWidth to wrap at
 * @param {string} text
 * @param {Number[]} charSize [height, width]
 * @param {Number} elementWidth The width of where to wrap
 * @returns {Number} The height of the text, if wrapped
 */
export const calculateWrap = (text, [charHeight, charWidth], elementWidth) => {
  return Math.ceil((charWidth * [...text].length) / elementWidth) * charHeight;
};

/**
 * Returns the length of the longest string in a list
 * @param {string[]} list
 * @returns {Number} The length of the longest string
 */
export const maxLength = list => {
  return list.reduce((max, next) => {
    return max > next.length ? max : next.length;
  }, 0);
};
