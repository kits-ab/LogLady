const initialState = { liveLines: [] };
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
    default:
      return state;
  }
};
