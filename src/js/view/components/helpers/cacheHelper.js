/**
 * CachedTransformedList is a cached list with that is transformed by some function (listFunc)
 * @param {function(object[], object)} listFunc
 * @returns {object}
 */
export class CachedTransformedList {
  constructor(listFunc) {
    this.transformedList = [];
    this.baseLength = 0;
    this.listFunc = listFunc
      ? listFunc
      : x => {
          return x;
        };
  }

  /**
   * Clears the list of items
   */
  reset() {
    this.transformedList = [];
    this.baseLength = 0;
  }

  /**
   * Updates the cached list with any new elements from the baseList, with the listFunc applied to the new elements
   * Extra arguments are bundled as an object and passed to the listFunc as the second parameter
   * @param {object[]} baseList
   * @param {object} args
   */
  update(baseList, args) {
    if (baseList.length <= this.baseLength) return;

    const newItems = this.listFunc(
      baseList.slice(Math.max(this.baseLength, 0)),
      args
    );

    this.transformedList.push(...newItems);

    this.baseLength = baseList.length;
  }

  /**
   * Returns the transformed list
   * @returns {object[]}
   */
  get() {
    return this.transformedList;
  }
}
