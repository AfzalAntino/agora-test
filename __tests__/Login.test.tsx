/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import Login from '../src/Screens/Login';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<Login />);
  });
});
