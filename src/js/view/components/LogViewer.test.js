import React from 'react';
import LogViewer from './LogViewer';
import { shallow, mount } from 'enzyme';

describe('LogViewer', () => {
  it('should set state to input', () => {
    const data = 'hej\nknas\nord\nbest\n';
    const dataBool = true;
    const filterText = 'hej';
    const wrapper = mount(<LogViewer lines={data} activeTail={dataBool} />);
    wrapper
      .find('#filterInput')
      .simulate('change', { target: { value: filterText } });
    expect(wrapper.state().lineFilterText).toEqual(filterText);
  });
});
