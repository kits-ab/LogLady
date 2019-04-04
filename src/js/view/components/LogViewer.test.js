import React from 'react';
import LogViewer from './LogViewer';
import { shallow, mount } from 'enzyme';

describe('LogViewer', () => {
  it.skip('should set state to input', () => {
    const data = 'hej\nknas\nord\nbest\n';
    const dataBool = true;
    const filterText = 'hej';
    const wrapper = mount(
      <LogViewer
        lines={data}
        activeTail={dataBool}
        filterInputFieldValue={filterText}
      />
    );
    wrapper
      .find('#filterInput')
      .simulate('change', { target: { value: filterText } });
    expect(wrapper.props().filterInputFieldValue).toEqual(filterText);
  });
});
