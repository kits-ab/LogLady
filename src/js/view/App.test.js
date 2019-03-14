import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';

describe('App', () => {
  it('renders without crashing', done => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
    done();
  });

  it('shallow renders App', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('div')).toHaveLength(1);
    expect(wrapper.find('p')).toHaveLength(5);
    expect(wrapper.find('pre')).toHaveLength(1);
  });

  it('should have a default state', () => {
    const defaultState = {
      lastLines: '',
      nthLines: '',
      time: '',
      numberOfLines: ''
    };
    const wrapper = shallow(<App />);
    expect(wrapper.state()).toEqual(defaultState);
  });
});
