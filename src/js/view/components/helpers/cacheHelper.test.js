import { CachedTransformedList } from './cacheHelper';

describe('CachedTransformedList', () => {
  describe('get', () => {
    it('should return empty list', () => {
      const list = new CachedTransformedList();
      const expectedResult = [];

      expect(list.get()).toEqual(expectedResult);
    });

    it('should return same list', () => {
      const list = new CachedTransformedList();
      const array = ['a', 'b', 'c'];
      const expectedResult = ['a', 'b', 'c'];

      list.diffAppend(array);

      expect(list.get()).toEqual(expectedResult);
    });

    it('should return subset of list', () => {
      const list = new CachedTransformedList(x => {
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
      const list = new CachedTransformedList();
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

      const list = new CachedTransformedList(f);

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

      const list = new CachedTransformedList(f);
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

      const list = new CachedTransformedList(f);

      const array = ['a', 'b', 'c', 'a', 'b', 'a', 'c', 'c', 'b'];

      array.forEach((_, i) => {
        list.diffAppend(array.slice(0, i + 1));
      });

      const expectedResult = ['a', 'b', 'a', 'b', 'a', 'b'];

      expect(list.get()).toEqual(expectedResult);
    });

    it('should not update old elements', () => {
      const list = new CachedTransformedList();
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
      const list = new CachedTransformedList();
      const array = ['a', 'b'];

      list.diffAppend(array);
      list.reset();

      expect(list.get()).toEqual([]);
    });

    it('should be possible to add new elements after resetting list', () => {
      const list = new CachedTransformedList();
      const array = ['a', 'b', 'c'];
      const array2 = ['q', 'h'];

      list.diffAppend(array);
      list.reset();
      list.diffAppend(array2);

      expect(list.get()).toEqual(array2);
    });
  });
});
