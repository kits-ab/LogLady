import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers/index.js';
import { ipcListener } from './ipcListener';
import * as ipcPublisher from './ipcPublisher';
import App from './App';
import { configureStore } from './configurations/configureStore';
const React = require('react');

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const publisher = configureStore(store);
ipcListener(store, publisher);
publisher.loadStateFromDisk();

class AppContainer extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App send={ipcPublisher} />
      </Provider>
    );
  }
}

export default AppContainer;
