export const initializeCache = cache_size => {
  const insertRows = (cacheList, startIndex, contentList) => {
    const totalLength = cacheList.length;

    contentList.forEach((item, i) => {
      cacheList[i + startIndex] = item;
    });

    const sliceIndex =
      totalLength < startIndex + contentList.length
        ? startIndex + contentList.length - cache_size
        : startIndex;

    const itemsToAdd = cacheList.slice(sliceIndex, sliceIndex + cache_size);

    const numberOfEmptyItemsAtEnd =
      totalLength - startIndex - itemsToAdd.length;

    console.log({
      cache_size,
      totalLength,
      startIndex,
      numberOfEmptyItemsAtEnd,
      itemsToAddLength: itemsToAdd.length
    });
    const addAtEnd =
      numberOfEmptyItemsAtEnd <= 0 ? [] : new Array(numberOfEmptyItemsAtEnd);

    return [...new Array(sliceIndex), ...itemsToAdd, ...addAtEnd];
  };

  return { insertRows };
};
