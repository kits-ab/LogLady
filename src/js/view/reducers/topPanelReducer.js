function parseRegex(string) {
  if (!string) return '';
  if ([...string][0] === '👑') {
    const regex = [...string].slice(1).join('');
    try {
      new RegExp(regex);
      return regex;
    } catch (e) {
      return '';
    }
  }

  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const topPanelReducer = (state = { tailSwitch: true }, action) => {
  switch (action.type) {
    case 'tailSwitch':
      return {
        ...state,
        tailSwitch: action.data
      };
    case 'filterInput':
      return {
        ...state,
        filterInput: parseRegex(action.data)
      };
    case 'highlightInput':
      return {
        ...state,
        highlightInput: parseRegex(action.data)
      };
    default:
      return state;
  }
};
