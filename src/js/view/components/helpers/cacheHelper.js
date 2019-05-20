/**
 * CachedReducedValue is a reducer that caches the latest reduced value and uses that as the start value to reduce further
 * @param {Function} reducerFunc a reducer function (curr, next) => *
 * @param {*} startValue the start value for the reduction function
 */
export const CachedReducedValue = (reducerFunc, startValue) => {
  let _reducerFunc = (_, next) => {
    return next;
  };
  let _startValue;
  let _diffLength;
  let _value;

  /**
   * Resets the cache and sets the value to the starting value
   */
  const reset = (reducerFunc, startValue) => {
    _startValue = startValue !== undefined ? startValue : _startValue;
    _value = _startValue;
    _reducerFunc = reducerFunc !== undefined ? reducerFunc : _reducerFunc;
    _diffLength = 0;
  };

  reset(reducerFunc, startValue);

  /**
   * Reduces the elements between the baseLength and the baseList's length with the existing value
   * If baseList is shorter, nothing happens
   * @param {*[]} baseList
   */
  const diffReduce = diffList => {
    if (diffList.length <= _diffLength) return;

    _value = diffList.slice(_diffLength).reduce(_reducerFunc, _value);

    _diffLength = diffList.length;
  };

  /**
   * Returns the reduced value
   * @returns {*}
   */
  const get = () => {
    return _value;
  };

  return {
    get,
    diffReduce,
    reset
  };
};

/**
 * CachedTransformedList is a cached list with that is transformed by some function (listFunc)
 * @param {Function} listFunc of type (object[], ...args) => object[]
 */
export const CachedTransformedList = listFunc => {
  let _listFunc = x => {
    return x;
  };
  let _transformedList;
  let _diffLength;

  /**
   * Clears the list of items
   */
  const reset = listFunc => {
    _transformedList = [];
    _listFunc = listFunc !== undefined ? listFunc : _listFunc;
    _diffLength = 0;
  };

  reset(listFunc);

  /**
   * Transforms and appends the elements between the baseLength and the baseList's length to the internal list
   * If baseList is shorter, nothing happens
   * @param {*[]} baseList
   * @param {...*} args
   */
  const diffAppend = diffList => {
    if (diffList.length <= _diffLength) return;

    const newItems = _listFunc(diffList.slice(_diffLength));

    _transformedList.push(...newItems);

    _diffLength = diffList.length;
  };

  /**
   * Returns the transformed list
   * @returns {*[]}
   */
  const get = () => {
    return _transformedList;
  };

  return {
    get,
    diffAppend,
    reset
  };
};
