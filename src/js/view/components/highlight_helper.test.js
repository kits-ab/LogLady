import { findMatches } from './highlight_helper';

describe('findMatches', () => {
  test('should return matching word', () => {
    const wordToMatch = 'hej';
    const rowArray = ['hej', 'test', 'match', 'stop'];
    const result = findMatches(wordToMatch, rowArray);
    expect(result).toEqual(['hej']);
  });
});
