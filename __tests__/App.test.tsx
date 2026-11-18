/**
 * @format
 */

import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import App from '../App';

jest.mock('../src/navigation/AppNavigator', () => {
  const { View } = require('react-native');
  return () => <View testID="app-navigator" />;
});

test('renders correctly', () => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    tree = ReactTestRenderer.create(<App />);
  });
  expect(tree!.toJSON()).toBeDefined();
  act(() => {
    tree!.unmount();
  });
});
