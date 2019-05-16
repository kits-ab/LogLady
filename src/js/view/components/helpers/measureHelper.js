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
 * Returns undefined if elementWidth is 0 or less, charHeight or charWidth are negative or if the charWidth is more than the elementWidth
 * @param {string} text
 * @param {Number[]} charSize [height, width] height and width needs to be positive, and width has to be lower than elementWidth
 * @param {Number} elementWidth The width of where to wrap, needs to be positive
 * @returns {Number} The height of the text, if wrapped
 */
export const calculateWrap = (text, [charHeight, charWidth], elementWidth) => {
  if (
    elementWidth <= 0 ||
    charHeight < 0 ||
    charWidth < 0 ||
    charWidth > elementWidth
  )
    return undefined;

  return Math.ceil((charWidth * [...text].length) / elementWidth) * charHeight;
};

export const calculateWraps = (lines, charSize, elementWidth) => {
  return lines.map(line => {
    return calculateWrap(line, charSize, elementWidth);
  });
};

/**
 * Works on any object that has a length, and objects that don't have lengths count as -Infinity, which in most if not all cases means ignoring them
 */
export const maxLengthReducer = (max, next) => {
  const length =
    next && next.length && typeof next.length === 'number'
      ? next.length
      : -Infinity;
  return max > length ? max : length;
};
