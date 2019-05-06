const initialState = { liveLines: [], nthLines: '' };
export const logViewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'clearLines':
      return {
        ...state,
        liveLines: []
      };
    case 'liveLines':
      return {
        ...state,
        liveLines: [...state.liveLines, ...action.data.split('\n')]
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
