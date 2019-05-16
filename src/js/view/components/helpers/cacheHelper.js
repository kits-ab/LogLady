export class CachedReducedValue {
  constructor(reducerFunc, startValue) {
    this.startValue = startValue;
    this.value = startValue;
    this.baseLength = 0;
    this.reducerFunc = reducerFunc
      ? reducerFunc
      : (_, next) => {
          return next;
        };
  }

  /**
   * Resets the cache and sets the value to the starting value
   */
  reset() {
    this.value = this.startValue;
    this.baseLength = 0;
  }

  /**
   * Reduces the elements between the baseLength and the baseList's length with the existing value
   */
  diffReduce(baseList) {
    if (baseList.length <= this.baseLength) return;

    this.value = baseList
      .slice(this.baseLength)
      .reduce(this.reducerFunc, this.value);

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
   * Transforms and appends the elements between the baseLength and the baseList's length to the internal list
   * Additional arguments are passed to listFunc
   * @param {object[]} baseList
   * @param {object} args
   */
  diffAppend(baseList, ...args) {
    if (baseList.length <= this.baseLength) return;

    const newItems = this.listFunc(baseList.slice(this.baseLength), ...args);

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
