import { settingsReducer } from './settingsReducer';

describe('settingsReducer', () => {
  const initialState = {
    tabSettings: {}
  };

  it('should return the initial state', () => {
    expect(settingsReducer(undefined, {})).toEqual(initialState);
  });

  it('should toggle showSettings ', () => {
    const createObject = {
      type: 'CREATE_SETTINGS_OBJECT',
      data: { sourcePath: 'file' }
    };

    const objectCreatedState = settingsReducer(initialState, createObject);

    const state = {
      ...objectCreatedState,
      tabSettings: {
        file: {
          ...objectCreatedState.tabSettings.file,
          showSettings: false
        }
      }
    };

    const expectedState = {
      ...state,
      tabSettings: {
        file: {
          ...objectCreatedState.tabSettings.file,
          showSettings: true
        }
      }
    };

    const action = {
      type: 'showSettings',
      data: { sourcePath: 'file' }
    };

    expect(settingsReducer(state, action)).toEqual(expectedState);
    expect(settingsReducer(expectedState, action)).toEqual(state);
  });

  it('should set highlightColor ', () => {
    const createObject = {
      type: 'CREATE_SETTINGS_OBJECT',
      data: { sourcePath: 'file' }
    };

    const objectCreatedState = settingsReducer(initialState, createObject);

    const expectedState = {
      ...objectCreatedState,
      tabSettings: {
        file: {
          ...objectCreatedState.tabSettings.file,
          highlightColor: 'yellow'
        }
      }
    };
    const action = {
      type: 'highlightColor',
      data: { sourcePath: 'file', color: 'yellow' }
    };

    expect(settingsReducer(objectCreatedState, action)).toEqual(expectedState);
  });
  it('should toggle wrapLineOn ', () => {
    const createObject = {
      type: 'CREATE_SETTINGS_OBJECT',
      data: { sourcePath: 'file' }
    };

    const objectCreatedState = settingsReducer(initialState, createObject);

    const expectedState = {
      ...objectCreatedState,
      tabSettings: {
        file: {
          ...objectCreatedState.tabSettings.file,
          wrapLineOn: true
        }
      }
    };

    const action = {
      type: 'wrapLineOn',
      data: { sourcePath: 'file' }
    };

    expect(settingsReducer(objectCreatedState, action)).toEqual(expectedState);
    expect(settingsReducer(expectedState, action)).toEqual(objectCreatedState);
  });
});
