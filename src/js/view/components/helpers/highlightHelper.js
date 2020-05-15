import { updateCurrentMarkedHighlight } from 'js/view/actions/dispatchActions';
let allHighlightedLines = {};
let dispatch;
let sourcePath;
let currentMarkedHighlight = [];
let updatedCache = false;

export const setSourcePath = source => {
  sourcePath = source;
};

export const setDispatcher = disp => {
  dispatch = disp;
};

export const updateAllHighlightedLines = lines => {
  console.log('Update highlight list');
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
  if (updatedCache) {
    highlightedLines.map(line => {
      if (currentMarkedHighlight[0] === line) {
        console.log('found it');
        return (line.mark = true);
      }
      return (line.mark = false);
    });
    updatedCache = false;
  }
  allHighlightedLines = { [sourcePath]: highlightedLines };
};

export const setCurrentMarkedHighlight = () => {
  currentMarkedHighlight = allHighlightedLines[sourcePath].filter(line => {
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

export const setCurrentMarkedHighlightWithItem = item => {
  currentMarkedHighlight[0] = item;
  updatedCache = true;
  console.log('The item is set as the new reference to current');
};

export const increment = () => {
  if (allHighlightedLines[sourcePath].length > 0) {
    const currentIndex = allHighlightedLines[sourcePath].findIndex(line => {
      return line.mark === true;
    });
    //console.log("current index", currentIndex);
    //console.log("Line+1: ", allHighlightedLines[sourcePath][currentIndex + 1]);
    if (allHighlightedLines[sourcePath][currentIndex + 1] !== undefined) {
      if (allHighlightedLines[sourcePath][currentIndex] !== undefined) {
        allHighlightedLines[sourcePath][currentIndex].mark = false;
      }
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
