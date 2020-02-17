import { calculateWrappedHeight } from './measureHelper';
import { sendRequestToBackend } from 'js/view/ipcPublisher';

export const createHeightReducer = (charSize, elWidth) => {
  return (map, next) => {
    const key = next.length;
    if (map[key]) return map; // No need to recalculate

    const height = calculateWrappedHeight(next, charSize, elWidth);
    return { ...map, [key]: height };
  };
};

export const createRegexReducer = regex => {
  return (lines, line) => {
    if (!regex || (regex && regex.test(line))) lines.push(line);
    return lines;
  };
};

export const scrollToBottom = (el, list) => {
  el.scrollAround(list.length - 1);
};

export const fetchTextBasedOnByteFromScrollPosition = (
  path,
  startByte,
  amountOfLines
) => {
  const argObj = {
    function: 'READ_LINES_AT_BYTE',
    data: { path, startByte, amountOfLines }
  };
  sendRequestToBackend(argObj);
};
