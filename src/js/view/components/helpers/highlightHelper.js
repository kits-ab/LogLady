import { updateCurrentMarkedHighlight } from 'js/view/actions/dispatchActions';

let allHighlightedLines = {};
let dispatch;
let sourcePath;

export const setDispatcher = disp => {
  dispatch = disp;
};

export const setSourcePath = source => {
  sourcePath = source;
};

export const updateAllHighlightedLines = lines => {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] !== undefined) {
      allHighlightedLines.length === 0
        ? (lines[i].mark = true)
        : (lines[i].mark = false);
      lines[i].originalIndex = i;
      if (lines[i].highlightLine === true) {
        allHighlightedLines.push(lines[i]);
      }
    }
  }
  setCurrentMarkedHighlight();
};

export const setCurrentMarkedHighlight = () => {
  const currentMarkedHighlight = allHighlightedLines.filter(line => {
    return line.mark === true;
  });
  updateCurrentMarkedHighlight(dispatch, sourcePath, currentMarkedHighlight);
};

export const increment = () => {
  if (allHighlightedLines.length > 0) {
    const currentIndex = allHighlightedLines.findIndex(line => {
      return line.mark === true;
    });
    if (allHighlightedLines[currentIndex + 1] !== undefined) {
      allHighlightedLines[currentIndex].mark = false;
      allHighlightedLines[currentIndex + 1].mark = true;
      setCurrentMarkedHighlight();
    }
  }
};
export const decrement = () => {
  if (allHighlightedLines.length > 0) {
    const currentIndex = allHighlightedLines.findIndex(line => {
      return line.mark === true;
    });
    if (allHighlightedLines[currentIndex - 1] !== undefined) {
      allHighlightedLines[currentIndex].mark = false;
      allHighlightedLines[currentIndex - 1].mark = true;
      setCurrentMarkedHighlight();
    }
  }
};
