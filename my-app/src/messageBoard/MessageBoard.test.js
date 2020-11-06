import { render, screen } from '@testing-library/react';
import MessageBoard from './MessageBoard';

test('renders learn react link', () => {
  render(<MessageBoard />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
