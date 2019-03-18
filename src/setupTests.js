import { doesNotReject } from 'assert';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

global.require = electron => {
  return {
    ipcRenderer: {
      send: message => {
        console.log('send', message);
      },
      on: (eventName, handler) => {
        console.log('on', eventName, handler);
      },
      once: (eventName, handler) => {
        console.log('once', eventName, handler);
    }
  }
};
};
