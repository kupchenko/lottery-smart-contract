import React from 'react';
import {render, screen} from '@testing-library/react';
import {Lottery} from './pages/Lottery';

test('renders learn react link', () => {
  render(<Lottery/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
