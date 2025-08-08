import { render } from '@testing-library/react';
import { UnoContainer } from './index';

describe('UnoContainer', () => {
    it('renders children', () => {
        const { getByText } = render(<UnoContainer>My UnoContainer</UnoContainer>);
        expect(getByText('My UnoContainer')).toBeInTheDocument();
    });

    it('renders children inside a div with m-auto classes', () => {
        const { container } = render(<UnoContainer>My UnoContainer</UnoContainer>);
        const div = container.querySelector('div');
        expect(div).toHaveClass('m-auto');
    });
});
