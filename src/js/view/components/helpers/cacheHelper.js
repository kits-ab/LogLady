/**
 * CachedReducedValue is a reducer that caches the latest reduced value and uses that as the start value to reduce further
 * @param {Function} reducerFunc a reducer function (curr, next) => *
 * @param {*} startValue the start value for the reduction function
 */
export class CachedReducedValue {
  constructor(reducerFunc, startValue) {
    this.startValue = startValue;
    this.value = startValue;
    this.baseLength = 0;
    this.reducerFunc = reducerFunc
      ? reducerFunc
      : () => {
          return (_, next) => {
            return next;
          };
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
   * If baseList is shorter, nothing happens
   * @param {*[]} baseList
   */
  diffReduce(baseList, ...args) {
    if (baseList.length <= this.baseLength) return;

    this.value = baseList
      .slice(this.baseLength)
      .reduce(this.reducerFunc(...args), this.value);

    this.baseLength = baseList.length;
  }

  /**
   * Returns the reduced value
   * @returns {*}
   */
  get() {
    return this.value;
  }
}

/**
 * CachedTransformedList is a cached list with that is transformed by some function (listFunc)
 * @param {Function} listFunc of type (object[], ...args) => object[]
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
   * If baseList is shorter, nothing happens
   * @param {*[]} baseList
   * @param {...*} args
   */
  diffAppend(baseList, ...args) {
    if (baseList.length <= this.baseLength) return;

    const newItems = this.listFunc(baseList.slice(this.baseLength), ...args);

    this.transformedList.push(...newItems);

    this.baseLength = baseList.length;
  }

  /**
   * Returns the transformed list
   * @returns {*[]}
   */
  get() {
    return this.transformedList;
  }
}
