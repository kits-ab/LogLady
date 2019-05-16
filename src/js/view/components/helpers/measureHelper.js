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

export const calculateWraps = (lines, charSize, elementWidth) => {
  return lines.map(line => {
    return calculateWrap(line, charSize, elementWidth);
  });
};

export const maxLengthReducer = (max, next) => {
  return max > next.length ? max : next.length;
};
