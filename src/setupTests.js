import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.require = electron => {
  return {
    ipcRenderer: {
      send: message => {
        // console.log('send', message);
      },
      on: (eventName, handler) => {
        // console.log('on', eventName, handler);
      },
      once: (eventName, handler) => {
        // console.log('once', eventName, handler);
      }
    }
  };
};

global.MutationObserver = class {
  disconnect() {}
  observe(element, initObject) {}
};

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

HTMLCanvasElement.prototype.getContext = () => {};

Element.prototype.scrollTo = () => {};
