import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

window.ipcRenderer = {
  on: jest.fn(),
  send: jest.fn()
};

global.MutationObserver = class {
  disconnect() {}
  observe(element, initObject) {}
};

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

HTMLCanvasElement.prototype.getContext = () => {};

Element.prototype.scrollTo = () => {};
