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

export const fetchNewLinesFromBackendCache = (
  sourcePath,
  nrOfLogLines,
  indexForNewLines,
  totalLineCountOfFile,
  getEndOfFile
) => {
  const argObj = {
    function: 'FETCH_NEW_LINES_FROM_BACKEND_CACHE',
    data: {
      sourcePath,
      nrOfLogLines,
      indexForNewLines,
      totalLineCountOfFile,
      getEndOfFile
    }
  };
  sendRequestToBackend(argObj);
};

export const fetchFilteredLinesFromBackend = (
  sourcePath,
  filterRegexString,
  previousFilteredLinesLength
) => {
  const argObj = {
    function: 'FETCH_FILTERED_LINES_FROM_BACKEND',
    data: {
      sourcePath,
      filterRegexString,
      previousFilteredLinesLength
    }
  };
  sendRequestToBackend(argObj);
};

export const updateLogViewerCache = cache_length => {
  const insertRows = (startIndex, newLines) => {
    const updatedCache = new Array(cache_length).fill(undefined, 0);

    // Check of the index to make sure that the beginning or the end of the file
    // are not cut off at the top or bottom of the list.
    const fromIndex =
      startIndex < 0
        ? 0
        : newLines.length + startIndex > cache_length
        ? cache_length - newLines.length
        : startIndex;

    newLines.forEach((item, i) => {
      updatedCache[i + fromIndex] = item;
    });

    return updatedCache;
  };
  return { insertRows };
};
