/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', () => {
  const tree = ReactTestRenderer.create(<App />);
  expect(tree.toJSON()).toBeDefined();
});
