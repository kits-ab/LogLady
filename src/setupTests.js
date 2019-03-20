import { doesNotReject } from 'assert';

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

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
