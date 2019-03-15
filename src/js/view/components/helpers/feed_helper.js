export const filterMatchingRows = (filterText, rows) => {
  const rowArray = rows.split('\n');
  const filteredArray = rowArray.filter(item => item.match(filterText));
  return filteredArray[filteredArray.length - 1] === ''
    ? filteredArray.slice(0, filteredArray.length - 1)
    : filteredArray;
};
