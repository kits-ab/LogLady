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

export const maxLength = list => {
  return list.reduce((max, next) => {
    return max > next.length ? max : next.length;
  }, 0);
};
