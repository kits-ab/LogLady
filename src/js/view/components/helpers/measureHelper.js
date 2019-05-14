/**
 *
 * @param {html} content
 * @param {html container} ruler
 */
export const calculateSize = (content, ruler) => {
  ruler.innerHTML = content;
  return [ruler.offsetHeight, ruler.offsetWidth];
};

export const calculateWrap = ([charHeight, charWidth], text, elementWidth) => {
  return Math.ceil((charWidth * [...text].length) / elementWidth) * charHeight;
};
