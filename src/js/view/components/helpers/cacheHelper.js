export class CachedReducedValue {
  constructor(reducerFunc, startValue) {
    this.startValue = startValue;
    this.value = startValue;
    this.baseLength = 0;
    this.reducerFunc = reducerFunc;
  }

  /**
   * Resets the cache and sets the value to the starting value
   */
  reset() {
    this.value = this.startValue;
    this.baseLength = 0;
  }

  /**
   * Reduces the current value with all the new values
   */
  update(baseList, args) {
    if (baseList.length <= this.baseLength) return;

    this.value = [
      this.value,
      ...baseList.slice(Math.max(this.baseLength, 0))
    ].reduce(this.reducerFunc(args));

    this.baseLength = baseList.length;
  }

  /**
   * Returns the reduced value
   * @returns {object}
   */
  get() {
    return this.value;
  }
}

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
