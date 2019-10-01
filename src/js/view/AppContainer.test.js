/* As window.ipcRenderer is added by the preload script in Electron, setupTests.js adds a mockup of it. This test won't test if the app works just that it compiles with no errors */

import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './AppContainer';

describe('AppContainer', () => {
  it('renders without crashing', done => {
    const div = document.createElement('div');
    ReactDOM.render(<AppContainer />, div);
    ReactDOM.unmountComponentAtNode(div);
    done();
  });
});
