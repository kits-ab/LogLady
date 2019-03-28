import React from 'react';
import LogViewer from './LogViewer';
import { shallow } from 'enzyme';

describe('LogViewer', () => {
  it('should set state to input', () => {
    const data = 'hej\nknas\nord\nbest\n';
    const filterText = 'hej';
    const wrapper = shallow(<LogViewer lines={data} />);
    wrapper
      .find('#filterInput')
      .simulate('change', { target: { value: filterText } });
    expect(wrapper.state().lineFilterText).toEqual(filterText);
  });
});
