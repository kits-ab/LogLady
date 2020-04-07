export const updateLogViewerCache = cache_size => {
  const insertRows = (startIndex, newLines) => {
    const updatedCache = new Array(cache_size).fill('.', 0);

    const fromIndex =
      startIndex < 0
        ? 0
        : newLines.length + startIndex > cache_size
        ? cache_size - newLines.length
        : startIndex;

    newLines.forEach((item, i) => {
      updatedCache[i + fromIndex] = item;
    });

    // console.log({ updatedCache });

    return updatedCache;
  };
  return { insertRows };
};
