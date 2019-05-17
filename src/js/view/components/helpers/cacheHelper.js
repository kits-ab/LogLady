/**
 * CachedReducedValue is a reducer that caches the latest reduced value and uses that as the start value to reduce further
 * @param {Function} reducerFunc a reducer function (curr, next) => *
 * @param {*} startValue the start value for the reduction function
 */
export class CachedReducedValue {
  constructor(reducerFunc, startValue) {
    this.reducerFunc = reducerFunc
      ? reducerFunc
      : (_, next) => {
          return next;
        };

    this.reset(reducerFunc, startValue);
  }

  /**
   * Resets the cache and sets the value to the starting value
   */
  reset(reducerFunc, startValue) {
    this.startValue = startValue !== undefined ? startValue : this.startValue;
    this.value = this.startValue;
    this.reducerFunc =
      reducerFunc !== undefined ? reducerFunc : this.reducerFunc;
    this.baseLength = 0;
  }

  /**
   * Reduces the elements between the baseLength and the baseList's length with the existing value
   * If baseList is shorter, nothing happens
   * @param {*[]} baseList
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
    this.listFunc = listFunc
      ? listFunc
      : x => {
          return x;
        };

    this.reset(listFunc);
  }

  /**
   * Clears the list of items
   */
  reset(listFunc) {
    this.transformedList = [];
    this.listFunc = listFunc !== undefined ? listFunc : this.listFunc;
    this.baseLength = 0;
  }

  /**
   * Transforms and appends the elements between the baseLength and the baseList's length to the internal list
   * If baseList is shorter, nothing happens
   * @param {*[]} baseList
   * @param {...*} args
   */
  diffAppend(baseList) {
    if (baseList.length <= this.baseLength) return;

    const newItems = this.listFunc(baseList.slice(this.baseLength));

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
