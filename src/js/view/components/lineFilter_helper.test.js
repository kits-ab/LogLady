import { findMatches } from './lineFilter_helper';

describe('findMatches', () => {
  test('should return matching word', () => {
    const lineFilterInput = 'hej';
    const lineArray = ['hej', 'test', 'match', 'stop'];
    const result = findMatches(lineFilterInput, lineArray);
    expect(result).toEqual(['hej']);
  });
});