/**
 * new CachedTransformedList is a cached list with some function (listFunc)
 * applied to all elements in the list
 * @param {function(object[], object)} listFunc
 * @returns {object}
 */
export const CachedTransformedList = listFunc => {
  let transformedList = [];
  let baseLength = 0;

  /**
   * Resets the list
   */
  const reset = () => {
    transformedList = [];
    baseLength = 0;
  };

  /**
   * Updates the cached list with any new elements from the baseList, with the listFunc applied to the new elements
   * Extra arguments are bundled as an object and passed to the listFunc as the second parameter
   * @param {object[]} baseList
   * @param {object} args
   */
  const update = (baseList, args) => {
    if (baseList.length <= baseLength) return;

    const newItems = listFunc(baseList.slice(Math.max(baseLength, 0)), args);

    transformedList.push(...newItems);

    baseLength = baseList.length;
  };

  /**
   * Returns the transformed list
   * @returns {object[]}
   */
  const get = () => {
    return transformedList;
  };

  return {
    update,
    get,
    reset
  };
};
