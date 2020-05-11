let allHighlightedLines = [];

export const updateHighlightMark = lines => {
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
  const filteredHighlightMark = allHighlightedLines.filter(line => {
    return line.mark === true;
  });
  return filteredHighlightMark;
};

export const increment = () => {
  const findIndex = allHighlightedLines.findIndex(line => {
    return line.mark === true;
  });
  allHighlightedLines[findIndex].mark = false;
  allHighlightedLines[findIndex + 1].mark = true;
};

export const decrement = () => {
  const findIndex = allHighlightedLines.findIndex(line => {
    return line.mark === true;
  });
  allHighlightedLines[findIndex].mark = false;
  allHighlightedLines[findIndex - 1].mark = true;
};
