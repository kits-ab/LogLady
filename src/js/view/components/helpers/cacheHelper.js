export const initializeCache = cache_size => {
  const insertRows = (list, startIndex, contentList) => {
    const totalLength = list.length;

    contentList.forEach((item, i) => {
      list[i + startIndex] = item;
    });

    const sliceIndex =
      totalLength < startIndex + contentList.length
        ? startIndex + contentList.length - cache_size
        : startIndex;

    const itemsToAdd = list.slice(sliceIndex, sliceIndex + cache_size);

    const numberOfEmptyItemsAtEnd =
      totalLength - startIndex - itemsToAdd.length;
    const addAtEnd =
      numberOfEmptyItemsAtEnd <= 0 ? [] : new Array(numberOfEmptyItemsAtEnd);

    return [...new Array(sliceIndex), ...itemsToAdd, ...addAtEnd];
  };

  return { insertRows };
};
