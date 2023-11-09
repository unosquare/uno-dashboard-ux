import React from 'react';
import { render } from '@testing-library/react';
import { NavBar } from './index';

describe('NavBar', () => {
    it('renders children', () => {
        const { getByText } = render(<NavBar transparent={false}>Hello World</NavBar>);
        expect(getByText('Hello World')).toBeInTheDocument();
    });

    it('applies transparent class when transparent prop is true', () => {
        const { container } = render(
            <NavBar transparent>
                <div>Hello World</div>
            </NavBar>,
        );
        expect(container.firstChild).toHaveClass('bg-transparent');
    });

    it('does not apply transparent class when transparent prop is false', () => {
        const { container } = render(
            <NavBar transparent={false}>
                <div>Hello World</div>
            </NavBar>,
        );
        expect(container.firstChild).not.toHaveClass('bg-transparent');
    });
});
