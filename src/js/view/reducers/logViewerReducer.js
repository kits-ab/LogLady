const initialState = { liveLines: '', nthLines: '' };
export const logViewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'liveLines':
      return {
        ...state,
        liveLines: state.liveLines
          ? state.liveLines + '\n' + action.data
          : action.data
      };
    case 'nthLines':
      return {
        ...state,
        nthLines: action.data
      };
    default:
      return state;
  }
};
