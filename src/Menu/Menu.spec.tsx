import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Burger } from './index';

describe('Burger', () => {
  it('renders without crashing', () => {
    const { container } = render(<Burger onClick={() => { }} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { container } = render(<Burger onClick={handleClick} />);
    fireEvent.click(container.firstChild as Element);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});