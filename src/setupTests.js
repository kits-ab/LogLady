import { doesNotReject } from 'assert';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.require = electron => ({
  ipcRenderer: {
    send: message => {
      // console.log('send', message);
    },
    on: (eventName, handler) => {
      // console.log('on', eventName, handler);
    }
  }
});
