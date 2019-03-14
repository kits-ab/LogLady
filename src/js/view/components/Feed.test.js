import React from 'react';
import Feed from './Feed';
import { FeedView } from '../styled_components/Containers';
import { Input, Button } from '../styled_components/Interactions';
import { shallow } from 'enzyme';

describe('Feed', () => {
  it('should render Feed with no data', () => {
    const wrapper = shallow(<Feed />);
    expect(wrapper.find(FeedView)).toHaveLength(1);
    expect(wrapper.find('p')).toHaveLength(0);
  });
  it('should render Feed with some data', () => {
    const data = '123\n234\n345\n456\n';
    const wrapper = shallow(<Feed rows={data} />);
    expect(wrapper.find(FeedView)).toHaveLength(1);
    expect(wrapper.find('p')).toHaveLength(5);
  });
  it('should render Feed with some filtered data', () => {
    const data = '123\n234\n345\n456\n';
    const wrapper = shallow(<Feed rows={data} />);
    wrapper.find(Input).simulate('change', { target: { value: 34 } });
    expect(wrapper.find('p')).toHaveLength(2);
    expect(wrapper.state()).toEqual({
      filterText: 34,
      live: false
    });
  });
  it('should switch to live mode', () => {
    const wrapper = shallow(<Feed />);
    wrapper.find(Button).simulate('click');
    expect(wrapper.state()).toEqual({
      filterText: '',
      live: true
    });
  });
});
