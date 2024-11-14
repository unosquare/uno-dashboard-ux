import { render } from '@testing-library/react';
import React from 'react';
import { UnoLogo } from './index';

describe('UnoLogo', () => {
    it('renders without crashing', () => {
        const { container } = render(<UnoLogo />);
        expect(container.firstChild).toBeInTheDocument();
    });
});
