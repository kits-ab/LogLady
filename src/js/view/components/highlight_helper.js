import { HighlightText } from '../styled_components/HighlightText';

export const matchHighlightText = (textToHighlight, rows) => {
  let rowArray = [];
  rowArray.push(rows.split('\n'));

  const stuff = rowArray.filter(item => {
    const regex = new RegExp(textToHighlight, 'gi');
    //   console.log('item', item);

    return item.match(regex);
  });
  return stuff;
};

export const matchRows = (rowsToMatch, rows) => {
  const rowArray = rows.split('\n');
  const filtered = rowArray.filter(item => {
    return item.match(rowsToMatch);
  });
  //   console.log(filtered[filtered.length - 1]);
  //   return filtered[filtered.length - 1] === '' ? (
  //     <HighlightText>{filtered}</HighlightText>
  //   ) : (
  //     filtered
  //   );

  return filtered[filtered.length - 1] === ''
    ? filtered.slice(0, filtered.length - 1)
    : filtered;
};

export const findMatches = (wordToMatch, rowArray) => {
  console.log('rowArray:', rowArray);
  console.log('wordToMatch:', wordToMatch);
};
