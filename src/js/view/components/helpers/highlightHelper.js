import { updateCurrentMarkedHighlight } from 'js/view/actions/dispatchActions';
let allHighlightedLines = {};
let dispatch;
let sourcePath;

export const setSourcePath = source => {
  sourcePath = source;
};

export const setDispatcher = disp => {
  dispatch = disp;
};

export const updateAllHighlightedLines = lines => {
  let highlightedLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] !== undefined) {
      if (lines[i].highlightLine === true) {
        highlightedLines.push(lines[i]);
      }
    }
  }
  highlightedLines.map(line => {
    return (line.mark = false);
  });
  allHighlightedLines = { [sourcePath]: highlightedLines };
};

export const setCurrentMarkedHighlight = () => {
  let currentMarkedHighlight = allHighlightedLines[sourcePath].filter(line => {
    return line.mark === true;
  });

  if (currentMarkedHighlight.length === 0) {
    allHighlightedLines[sourcePath].map((line, index) => {
      if (index === 0) {
        return (line.mark = true);
      } else {
        return (line.mark = false);
      }
    });
    currentMarkedHighlight = allHighlightedLines[sourcePath].filter(line => {
      return line.mark === true;
    });
  }
  if (dispatch !== undefined) {
    updateCurrentMarkedHighlight(dispatch, sourcePath, currentMarkedHighlight);
  }
};

export const increment = () => {
  if (allHighlightedLines[sourcePath].length > 0) {
    const currentIndex = allHighlightedLines[sourcePath].findIndex(line => {
      return line.mark === true;
    });
    if (allHighlightedLines[sourcePath][currentIndex + 1] !== undefined) {
      allHighlightedLines[sourcePath].map(line => {
        return (line.mark = false);
      });
      allHighlightedLines[sourcePath][currentIndex + 1].mark = true;
      setCurrentMarkedHighlight();
    }
  }
};
export const decrement = () => {
  if (allHighlightedLines[sourcePath].length > 0) {
    const currentIndex = allHighlightedLines[sourcePath].findIndex(line => {
      return line.mark === true;
    });
    if (allHighlightedLines[sourcePath][currentIndex - 1] !== undefined) {
      allHighlightedLines[sourcePath].map(line => {
        return (line.mark = false);
      });
      allHighlightedLines[sourcePath][currentIndex - 1].mark = true;
      setCurrentMarkedHighlight();
    }
  }
};
