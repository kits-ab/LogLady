import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers/index.js';
import { ipcListener } from './ipcListener';
import * as ipcPublisher from './ipcPublisher';
import App from './App';
import { configureStore } from './configurations/configureStore';
import { Fabric } from 'office-ui-fabric-react';
const React = require('react');

// Create store with undefined initial state and use the redux devtools if available
const store = createStore(
  reducers,
  undefined,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const publisher = configureStore(store);
ipcListener(store, publisher);
publisher.loadStateFromDisk();

class AppContainer extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Fabric>
          <App send={ipcPublisher} />
        </Fabric>
      </Provider>
    );
  }
}

export default AppContainer;
