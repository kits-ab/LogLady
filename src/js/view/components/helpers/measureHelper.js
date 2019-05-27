/**
 * Puts the text in the ruler HTML element and returns the height and width
 * @param {string} text
 * @param {HTMLElement} ruler
 * @returns {Number[]} [height, width]
 */
export const calculateSize = (ruler, innerHTML) => {
  if (innerHTML !== undefined) ruler.innerHTML = innerHTML;
  const rect = ruler.getBoundingClientRect();
  return [rect.height, rect.width];
};

/**
 * Returns the height of text given a charSize and an elementWidth to wrap at
 * Returns undefined if elementWidth is 0 or less, charHeight or charWidth are negative or if the charWidth is more than the elementWidth
 * @param {string} text
 * @param {Number[]} charSize [height, width] height and width needs to be positive, and width has to be lower than elementWidth
 * @param {Number} elementWidth The width of where to wrap, needs to be positive
 * @returns {Number} The height of the text, if wrapped
 */
export const calculateWrappedHeight = (
  text,
  [charHeight, charWidth],
  elementWidth
) => {
  if (charWidth <= 0 || charHeight <= 0)
    throw new Error('character size has zero or negative values');

  if (charWidth > elementWidth)
    throw new Error('character width is wider than element width: ', {
      charWidth: charWidth,
      elementWidth: elementWidth
    });

  if (elementWidth <= 0)
    throw new Error('element width is equal or less to 0: ', elementWidth);

  const usableWidth = elementWidth - (elementWidth % charWidth);
  return Math.ceil((charWidth * [...text].length) / usableWidth) * charHeight;
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
