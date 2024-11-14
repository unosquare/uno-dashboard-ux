import { render } from '@testing-library/react';
import React from 'react';
import { Blur } from './index';

describe('Blur', () => {
    it('renders without crashing', () => {
        const { container } = render(<Blur />);
        expect(container.firstChild).toBeInTheDocument();
        expect(container.firstChild).toHaveClass('w-full');
    });
});
