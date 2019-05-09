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
