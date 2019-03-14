import React from 'react';
import { Button } from './Interactions';
import { shallow } from 'enzyme';

describe('Interactions', () => {
  describe('Button', () => {
    it('should render default Button', () => {
      const wrapper = shallow(<Button live={false} />);
      expect(wrapper.props().live).toBe(false);
    });
    it('should render live Button', () => {
      const wrapper = shallow(<Button live={true} />);
      expect(wrapper.props().live).toBe(true);
    });
  });
});
