import { CachedTransformedList, CachedReducedValue } from './cacheHelper';

describe('CachedReducedValue', () => {
  const maxFunc = (max, next) => {
    return next > max ? next : max;
  };

  describe('get', () => {
    it('should return start value', () => {
      const value = CachedReducedValue(undefined, 45);
      const expectedResult = 45;

      expect(value.get()).toEqual(expectedResult);
    });

    it('should return latest value', () => {
      const value = CachedReducedValue();
      const array = ['a', 'b', 'c'];
      const expectedResult = 'c';

      value.diffReduce(array);

      expect(value.get()).toEqual(expectedResult);
    });
  });

  describe('diffReduce', () => {
    it('should return max value', () => {
      const value = CachedReducedValue(maxFunc, 0);
      const array = [1, 2, 4, 65, 8, 2, 2, 6];
      const expectedResult = 65;

      value.diffReduce(array);

      expect(value.get()).toEqual(expectedResult);
    });

    it('should not reduce old elements', () => {
      const value = CachedReducedValue(maxFunc, 0);
      const array = [1, 2];
      const array2 = [65, 100, 1];
      const expectedResult = 2;

      value.diffReduce(array);
      value.diffReduce(array2);

      expect(value.get()).toEqual(expectedResult);
    });
  });

  describe('reset', () => {
    it('should return start value', () => {
      const value = CachedReducedValue(maxFunc, 1);
      const array = [2, 3, 4, 5];
      const expectedResult = 1;

      value.diffReduce(array);
      value.reset();

      expect(value.get()).toEqual(expectedResult);
    });

    it('should be possible to add reduce new values after resetting value', () => {
      const value = CachedReducedValue();
      const array = ['a', 'b', 'c'];
      const array2 = ['q', 'h'];
      const expectedResult = 'h';

      value.diffReduce(array);
      value.reset();
      value.diffReduce(array2);

      expect(value.get()).toEqual(expectedResult);
    });
  });
});

describe('CachedTransformedList', () => {
  describe('get', () => {
    it('should return empty list', () => {
      const list = CachedTransformedList();
      const expectedResult = [];

      expect(list.get()).toEqual(expectedResult);
    });

    it('should return same list', () => {
      const list = CachedTransformedList();
      const array = ['a', 'b', 'c'];
      const expectedResult = ['a', 'b', 'c'];

      list.diffAppend(array);

      expect(list.get()).toEqual(expectedResult);
    });

    it('should return subset of list', () => {
      const list = CachedTransformedList(x => {
        return x.slice(1);
      });

      const array = ['a', 'b', 'c'];
      const expectedResult = ['b', 'c'];

      list.diffAppend(array);

      expect(list.get()).toEqual(expectedResult);
    });
  });

  describe('diffAppend', () => {
    it('should append new elements', () => {
      const list = CachedTransformedList();
      list.diffAppend(['a']);
      expect(list.get()).toEqual(['a']);
      list.diffAppend(['a', 'b']);
      expect(list.get()).toEqual(['a', 'b']);
      list.diffAppend(['a', 'b', 'c']);
      expect(list.get()).toEqual(['a', 'b', 'c']);
    });
    it('should apply function', () => {
      const f = x => {
        return x.filter(y => {
          return y;
        });
      };

      const list = CachedTransformedList(f);

      const array = [false, true, false, false, true];
      const expectedResult = f(array); // [true, true]

      list.diffAppend(array);
      expect(list.get()).toEqual(expectedResult);
    });

    it('should apply function to new elements', () => {
      const f = x => {
        return x.map(y => {
          return y + 1;
        });
      };

      const list = CachedTransformedList(f);
      const array = [1, 2, 3, 4, 5, 4, 3, 999];
      const expectedResult = [2, 3, 4, 5, 6, 5, 4, 1000];

      array.forEach((_, i) => {
        list.diffAppend(array.slice(0, i + 1));
      });

      expect(list.get()).toEqual(expectedResult);
    });

    it('should append to smaller array', () => {
      const f = x => {
        return x.filter(y => {
          return y.match(/a|b/);
        });
      };

      const list = CachedTransformedList(f);

      const array = ['a', 'b', 'c', 'a', 'b', 'a', 'c', 'c', 'b'];

      array.forEach((_, i) => {
        list.diffAppend(array.slice(0, i + 1));
      });

      const expectedResult = ['a', 'b', 'a', 'b', 'a', 'b'];

      expect(list.get()).toEqual(expectedResult);
    });

    it('should not update old elements', () => {
      const list = CachedTransformedList();
      const array = ['a', 'b'];
      const array2 = ['q', 'h', 'c'];
      const expectedResult = ['a', 'b', 'c'];

      list.diffAppend(array);
      list.diffAppend(array2);

      expect(list.get()).toEqual(expectedResult);
    });
  });

  describe('reset', () => {
    it('should return empty list', () => {
      const list = CachedTransformedList();
      const array = ['a', 'b'];

      list.diffAppend(array);
      list.reset();

      expect(list.get()).toEqual([]);
    });

    it('should be possible to add new elements after resetting list', () => {
      const list = CachedTransformedList();
      const array = ['a', 'b', 'c'];
      const array2 = ['q', 'h'];

      list.diffAppend(array);
      list.reset();
      list.diffAppend(array2);

      expect(list.get()).toEqual(array2);
    });
  });
});
